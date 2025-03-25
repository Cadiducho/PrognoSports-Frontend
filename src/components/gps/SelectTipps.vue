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
            color="teal"
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
          <div class="box mt-1">
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
          </div>
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
        <h3 class="select-none dark:text-gray-300">
          Tu pronóstico
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

      <div
        v-else
        class="notification is-warning is-light"
      >
        El pronóstico debe tener {{ ruleSet.cantidadPilotosPronosticados(session) }} pilotos escogidos y ordenados (Has
        escogido {{ pilotosPronosticados.length }}).
      </div>
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

<script lang="ts">
import {RaceSession} from "@/types/RaceSession";
import {grandPrixService, notificationService} from "@/_services";
import {GrandPrix} from "@/types/GrandPrix";
import {Driver} from "@/types/Driver";
import {RaceResult} from "@/types/RaceResult";
import {StartGridPosition} from "@/types/StartGridPosition";
import {RuleSet} from "@/types/RuleSet";

import {defineComponent, PropType, reactive, ref, watch} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import {useStyles} from "@/composables/useStyles";

import draggable from 'vuedraggable'
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import DraggableDriverCard from "@/components/gps/DraggableDriverCard.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PRadio from "@/components/lib/forms/PRadio.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import PCollapse from "@/components/lib/PCollapse.vue";

export default defineComponent({
  name: "SelectTipps",
  components: {
    PCollapse,
    PInput,
    PRadio,
    PButton,
    DraggableDriverCard,
    PrognoAlert,
    draggable
  },
  props: {
    session: {
      type: Object as PropType<RaceSession>,
      required: true,
    },
    grandPrix: {
      type: Object as PropType<GrandPrix>,
      required: true,
    },
    ruleSet: {
      type: Object as PropType<RuleSet>,
      required: true,
    },
    drivers: {
      type: Array as PropType<Array<Driver>>,
      required: true,
    },
    startGrids: {
      type: Map as PropType<Map<RaceSession, Array<StartGridPosition>>>,
      required: true,
    },
  },
  setup() {
    const authStore = useAuthStore();
    const communityStore = useCommunityStore();
    const styles = useStyles();

    const currentUser = authStore.loggedUser;
    const currentCommunity = communityStore.currentCommunity;
    const styleDriverCard = styles.styleDriverCard;
    const styleDorsal = styles.styleDorsal;

    return {currentUser, currentCommunity, styleDriverCard, styleDorsal};
  },
  data() {
    return {
      drag: false,
      filtroPiloto: '',
      opcionesOrdenadoOpen: false,
      orderType: 1,
      orderAscendent: false,
      sendingPronostico: false,

      pilotosPronosticados: new Array<Driver>(),
      pilotosDisponibles: new Array<Driver>(),
      originalPilotos: new Array<Driver>(),
      indexedGrid: new Map<number, number>(), // Dorsal del piloto -> Posicion en la grid
    }
  },
  mounted() {
    this.originalPilotos.push(...this.drivers);
    this.pilotosDisponibles.push(...this.drivers);

    for (let [session, grid] of this.startGrids) {
      if (session.id === this.session.id) {
        grid.forEach(gpos => {
          this.indexedGrid.set(gpos.driver.number, gpos.position);
        })
      }
    }

    grandPrixService.getUserTipps(this.grandPrix, this.session, this.currentCommunity, this.currentUser).then((userTipps) => {
      for (let key in userTipps) {
        let value: RaceResult = userTipps[key]!;

        // Básicamente, si hay pronóstico. De otro modo, driver es undefined (value es {})
        if (value.driver != undefined) {
          // Elimino al piloto pronosticado de la lsita de disponibles
          this.pilotosDisponibles = this.pilotosDisponibles.filter(d => d.code != value.driver.code);

          // Añado el piloto pronosticado a la lista de pronósticos
          this.pilotosPronosticados.push(value.driver);
        }
      }
    });
  },
  methods: {
    reiniciarPronostico() {
      this.pilotosPronosticados = [];
      this.pilotosDisponibles = [];
      this.pilotosDisponibles.push(...this.originalPilotos);
    },
    async enviarPronostico() {
      this.sendingPronostico = true;
      let tipps: Array<RaceResult> = [];

      this.pilotosPronosticados.forEach((driver: Driver, index: number, array: Driver[]) => {
        tipps.push({position: index + 1, driver: {id: driver.id} as Driver} as RaceResult);
      });

      try {
        await grandPrixService.postUserTipps(this.grandPrix, this.session, this.currentCommunity, tipps);
        notificationService.showNotification("¡Has guardado tus pronósticos!");
      } catch (error: any) {
        let message = "Error guardando tus pronósticos: " + error.message;

        notificationService.showNotification(message, "error");
      } finally {
        setTimeout(() => {
          this.sendingPronostico = false;
        }, 1000);
      }
    },
    aplicaFiltrito(driver: Driver) {
      let filtroLowerCase = this.filtroPiloto.toLowerCase();
      return driver.lastname.toLowerCase().includes(filtroLowerCase)
        || driver.firstname.toLowerCase().includes(filtroLowerCase)
        || driver.team.name.toLowerCase().includes(filtroLowerCase)
        || driver.team.longname.toLowerCase().includes(filtroLowerCase)
        || driver.team.carname.toLowerCase().includes(filtroLowerCase);
    }
  }
});
</script>
