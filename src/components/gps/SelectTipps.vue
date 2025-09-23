<template>
  <div class="content mt-5">
    <PrognoAlert message="Arrastra las tarjetas para completar tu pronóstico." />

    <div class="flex space-x-4 mb-4">
      <div class="flex-1">
        <h3 class="select-none dark:text-gray-300">
          Pilotos disponibles
        </h3>

        <section class="busqueda-ordenada mb-2">
          <p-button
            color="info"
            @click="opcionesOrdenadoOpen = !opcionesOrdenadoOpen"
          >
            Ordenar
          </p-button>

          <PInput
            v-model="filtroPiloto"
            placeholder="Buscar..."
            no-margin
          />
        </section>

        <PCollapse
          :open="opcionesOrdenadoOpen"
          class="box-ordenado"
        >
          <PCard class="mt-1">
            <label class="label">Orderar lista de pilotos</label>
            <div class="field mb-0">
              <PRadio
                v-model="orderType"
                :value="0"
              >
                Por nombre
              </PRadio>
            </div>
            <div class="field mb-0">
              <PRadio
                v-model="orderType"
                :value="1"
              >
                Por equipos
              </PRadio>
            </div>
            <div class="field mb-0">
              <PRadio
                v-model="orderType"
                :value="2"
              >
                Por dorsal
              </PRadio>
            </div>
            <div class="field mb-1">
              <PRadio
                v-if="indexedGrid.size > 0"
                v-model="orderType"
                :value="3"
              >
                Por parrilla
              </PRadio>
            </div>
            <label class="label mt-2">Dirección del orden</label>
            <div class="field">
              <PRadio
                v-model="orderAscendent"
                :value="true"
              >
                Orden ascendente
              </PRadio>
              <PRadio
                v-model="orderAscendent"
                :value="false"
              >
                Orden descendente
              </PRadio>
            </div>
          </PCard>
        </PCollapse>

        <draggable
          :id="`pronosticados-${session.id}`"
          class="w-full h-full select-none space-y-2"
          :list="pilotosDisponiblesFiltrados"
          group="people"
          item-key="name"
        >
          <template #item="{ element, index }">
            <DraggableDriverCard
              v-if="aplicaFiltrito(element)"
              :driver="element"
              :index="index"
              :show-position="false"
            />
          </template>
        </draggable>
      </div>

      <div class="flex-1">
        <h3 class="select-none dark:text-gray-300 inline-flex items-center gap-2">
          Tu pronóstico
          <PTag
            v-if="changed"
            color="warning"
          >
            Modificado
          </PTag>
        </h3>

        <draggable
          :id="`pronosticados-${session.id}`"
          class="w-full h-full select-none space-y-2"
          :list="pilotosPronosticados"
          group="people"
          item-key="name"
        >
          <template #item="{ element, index }">
            <DraggableDriverCard
              :driver="element"
              :index="index"
              show-position
            />
          </template>
        </draggable>
      </div>
    </div>

    <template v-if="session.isBeforeClosureDate()">
      <p-button
        v-if="pilotosPronosticados.length === ruleSet.cantidadPilotosPronosticados(session)"
        color="primary"
        expanded
        :disabled="sendingPronostico"
        @click="enviarPronostico"
      >
        Enviar pronóstico
      </p-button>

      <PrognoAlert
        v-else
        variant="warning"
      >
        El pronóstico debe tener {{ ruleSet.cantidadPilotosPronosticados(session) }} pilotos escogidos y ordenados (Has
        escogido {{ pilotosPronosticados.length }}).
      </PrognoAlert>
    </template>

    <p-button
      v-else
      type="soft"
      color="warning"
      expanded
      disabled
    >
      Ya no se puede pronosticar
    </p-button>

    <hr v-if="(pilotosPronosticados.length > 0) && session.isBeforeClosureDate()">
    <p-button
      v-if="(pilotosPronosticados.length > 0) && session.isBeforeClosureDate()"
      color="danger"
      type="soft"
      expanded
      @click="reiniciarPronostico"
    >
      Limpiar pronóstico
    </p-button>
  </div>
</template>

<script setup lang="ts">
import {RaceSession} from "@/types/RaceSession";
import {grandPrixService, notificationService} from "@/_services";
import {GrandPrix} from "@/types/GrandPrix";
import {Driver} from "@/types/Driver";
import {RaceResult} from "@/types/RaceResult";
import {StartGridPosition} from "@/types/StartGridPosition";
import {RuleSet} from "@/types/RuleSet";
import {computed, onMounted, reactive, ref} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";

import draggable from 'vuedraggable'
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import DraggableDriverCard from "@/components/gps/DraggableDriverCard.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PRadio from "@/components/lib/forms/PRadio.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import PCollapse from "@/components/lib/PCollapse.vue";
import useEmitter from "@/composables/useEmitter";
import PCard from "@/components/lib/PCard.vue";
import PTag from "@/components/lib/PTag.vue";

const props = defineProps<{
  session: RaceSession,
  grandPrix: GrandPrix,
  ruleSet: RuleSet,
  drivers: Array<Driver>,
  startGrids: Map<RaceSession, Array<StartGridPosition>>
}>();

const authStore = useAuthStore();
const communityStore = useCommunityStore();
const emitter = useEmitter();

const currentUser = authStore.loggedUser;
const currentCommunity = communityStore.currentCommunity;

const pilotosPronosticados = reactive(new Array<Driver>());
const pilotosGuardados = ref(new Array<Driver>());
const pilotosDisponibles = ref(new Array<Driver>());
const originalPilotos = new Array<Driver>();
const indexedGrid = reactive(new Map<number, number>());

const filtroPiloto = ref('');
const opcionesOrdenadoOpen = ref(false);
const orderType = ref(1);
const orderAscendent = ref(true);
const sendingPronostico = ref(false);

const pilotosDisponiblesFiltrados = computed({
  get() {
    const sortAlfabetico = (d1: Driver, d2: Driver) => (d1.lastname < d2.lastname ? -1 : 1);
    const sortEquipos = (d1: Driver, d2: Driver) => (d1.team.name < d2.team.name ? -1 : 1);
    const sortDorsal = (d1: Driver, d2: Driver) => (d1.number < d2.number ? -1 : 1);
    const sortParrilla = (d1: Driver, d2: Driver) => (indexedGrid.get(d1.number)! < indexedGrid.get(d2.number)! ? -1 : 1);

    let pickedSort: (d1: Driver, d2: Driver) => (number);
    switch (orderType.value) {
      case 1:
        pickedSort = sortEquipos;
        break;
      case 2:
        pickedSort = sortDorsal;
        break;
      case 3:
        pickedSort = sortParrilla;
        break;
      default:
        pickedSort = sortAlfabetico;
    }
    let listaOrdenada = pilotosDisponibles.value.sort(pickedSort);

    if (!orderAscendent.value) {
      listaOrdenada = listaOrdenada.reverse();
    }

    return listaOrdenada
  },
  set(newValue) {}
});

const changed = computed(() => {
  return pilotosGuardados.value.length !== pilotosPronosticados.length
    || pilotosGuardados.value.some((d, index) => d.code !== pilotosPronosticados[index].code);
})

const aplicaFiltrito = (driver: Driver) => {
  let filtroLowerCase = filtroPiloto.value.toLowerCase();
  return driver.lastname.toLowerCase().includes(filtroLowerCase)
    || driver.firstname.toLowerCase().includes(filtroLowerCase)
    || driver.team.name.toLowerCase().includes(filtroLowerCase)
    || driver.team.longname.toLowerCase().includes(filtroLowerCase)
    || driver.team.carname.toLowerCase().includes(filtroLowerCase);
}

const reiniciarPronostico = () => {
  pilotosPronosticados.splice(0, pilotosPronosticados.length);
  pilotosDisponibles.value.splice(0, pilotosDisponibles.value.length);
  pilotosDisponibles.value.push(...originalPilotos);
}

const enviarPronostico = async () => {
  sendingPronostico.value = true;
  let tipps: Array<RaceResult> = [];

  pilotosPronosticados.forEach((driver: Driver, index: number, array: Driver[]) => {
    tipps.push({position: index + 1, driver: {id: driver.id} as Driver} as RaceResult);
  });

  try {
    await grandPrixService.postUserTipps(props.grandPrix, props.session, currentCommunity, tipps);
    notificationService.showNotification("¡Has guardado tus pronósticos!");

    // Emitimos el evento para que la tabla de resultados sepa que se han actualizado los pronósticos
    emitter.emit('updatedTipps', { session: props.session, tipps: pilotosPronosticados });

    // Establecemos en la copia guardada los nuevos pronósticos, de esta forma ya no avisará al usuario de que ha cambiado
    pilotosGuardados.value = [];
    pilotosGuardados.value.push(...pilotosPronosticados);
  } catch (error: any) {
    let message = "Error guardando tus pronósticos: " + error.message;

    notificationService.showNotification(message, "error");
  } finally {
    setTimeout(() => {
      sendingPronostico.value = false;
    }, 1000);
  }
}

onMounted(async() => {
  originalPilotos.push(...props.drivers);
  pilotosDisponibles.value.push(...props.drivers);

  for (let [session, grid] of props.startGrids) {
    if (session.id === props.session.id) {
      grid.forEach(gpos => {
        indexedGrid.set(gpos.driver.number, gpos.position);
      })
    }
  }

  try {
    const userTipps = await grandPrixService.getUserTipps(props.grandPrix, props.session, currentCommunity, currentUser)
    for (let key in userTipps) {
      let value: RaceResult = userTipps[key]!;

      // Básicamente, si hay pronóstico. De otro modo, driver es undefined (value es {})
      if (value.driver != undefined) {
        // Elimino al piloto pronosticado de la lsita de disponibles
        pilotosDisponibles.value = pilotosDisponibles.value.filter(d => d.code != value.driver.code);

        // Añado el piloto pronosticado a la lista de pronósticos
        pilotosPronosticados.push(value.driver);
      }
    }
  } catch (error) {
    console.error("Error obteniendo los pronósticos del usuario", error);
  } finally {
    // Guardamos una copia de lo que tenía originalmente para comparar si ha cambiado
    pilotosGuardados.value.push(...pilotosPronosticados);
  }
})

</script>
