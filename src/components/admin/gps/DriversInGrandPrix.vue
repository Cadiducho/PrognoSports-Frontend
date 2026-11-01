<template>
  <PTitle type="subtitle">
    Pilotos y equipos del Gran Premio
  </PTitle>

  <PrognoAlert
    v-if="entryListClosed"
    variant="warning"
    message="Este Gran Premio ya se ha disputado: su lista de pilotos no se puede modificar."
  />

  <div class="flex flex-col md:flex-row gap-6">
    <div class="md:basis-1/5">
      <PSelect
        v-model="clonedGrandPrix"
        label="Clonar del Gran Premio..."
        :disabled="entryListClosed"
        @change="cloneDriversFromGrandPrix()"
      >
        <option
          v-for="gp in otherGPList"
          :key="gp.id"
          :value="gp"
        >
          {{ gp.name }}
        </option>
      </PSelect>

      <PLabel>
        Pilotos de <router-link
          class="text-brand-600 hover:underline dark:text-brand-300"
          :to="{name: 'adminDriversInSeason', params: {season: grandPrix.season.id}}"
        >
          {{ grandPrix.season.name }}
        </router-link>
      </PLabel>

      <draggable
        id="driversInSeason"
        class="w-full h-full select-none space-y-2 flex flex-col text-white"
        :list="driversInSeason"
        group="drivers"
        item-key="id"
      >
        <template #item="{ element }">
          <div class="flex cursor-move items-center justify-center rounded-lg bg-brand-accent-500 p-1 text-sm shadow-lg hover:bg-brand-accent-600">
            {{ element.firstname }} {{ element.lastname }} #{{ element.number }}
          </div>
        </template>
      </draggable>
    </div>
    <div class="min-w-0 md:basis-4/5">
      <PLabel>Pilotos en el Gran Premio</PLabel>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <PCard
          v-for="constructor in constructorList"
          :key="constructor.id"
          tag="div"
          padding="sm"
          :title="constructor.name"
          :header-style="teamCarColor(constructor)"
        >
          <draggable
            :id="`driversByConstructor-${constructor.id}`"
            class="h-full min-h-12 w-full select-none space-y-2"
            :list="driversByConstructor[constructor.id]"
            group="drivers"
            item-key="id"
          >
            <template #item="{ element }">
              <div class="flex cursor-move items-center justify-center rounded-md bg-gray-100 px-2 py-1 text-center text-sm hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
                {{ element.firstname }} {{ element.lastname }} #{{ element.number }}
              </div>
            </template>
          </draggable>
        </PCard>
      </div>
      <PButton
        class="mt-3"
        :disabled="entryListClosed"
        @click="saveDrivers()"
      >
        Guardar pilotos
      </PButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {GrandPrix} from "@/types/GrandPrix";
import {Dictionary} from "@/types/Dictionary";
import {Driver} from "@/types/Driver";
import {Constructor} from "@/types/Constructor";
import {constructorService, driversService, grandPrixService, notificationService} from "@/_services";
import {useStyles} from "@/composables/useStyles";
import draggable from "vuedraggable";
import PSelect from "@/components/lib/forms/PSelect.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PLabel from "@/components/lib/forms/PLabel.vue";
import PTitle from "@/components/lib/PTitle.vue";
import PCard from "@/components/lib/PCard.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";

const props = defineProps<{
  grandPrix: GrandPrix;
}>();

const {invertColor} = useStyles();

const driversInSeason = ref<Array<Driver>>([]);
const constructorList = ref<Array<Constructor>>([]);
const driversByConstructor = ref<Dictionary<string, Array<Driver>>>({});
const otherGPList = ref<Array<GrandPrix>>([]);
const clonedGrandPrix = ref<GrandPrix>({} as GrandPrix);

// Si ya ha empezado la última sesión, la lista de pilotos queda cerrada (el backend también lo bloquea)
const entryListClosed = computed(() => props.grandPrix.hasStartedLastSession());

async function loadDriversInGrandPrix(gp: GrandPrix) {
  const [driversInGrandPrix, constructors] = await Promise.all([
    driversService.getDriversInGrandPrix(gp),
    constructorService.getConstructorsInSeason(gp.season),
  ]);

  const byConstructor: Dictionary<string, Array<Driver>> = {};
  constructors.forEach((c) => {
    byConstructor[c.id] = [];
  });
  driversInGrandPrix.forEach((d) => {
    byConstructor[d.team.id] = [...byConstructor[d.team.id] ?? [], d];
  });

  constructorList.value = [...constructors];
  driversByConstructor.value = byConstructor;
}

async function cloneDriversFromGrandPrix() {
  clonedGrandPrix.value.competition = props.grandPrix.competition;
  clonedGrandPrix.value.season = props.grandPrix.season;

  try {
    await loadDriversInGrandPrix(clonedGrandPrix.value);
  } catch (error: any) {
    notificationService.showNotification(error.message ?? "Ha ocurrido un error.", "error");
  }
}

async function saveDrivers() {
  try {
    await driversService.setDriversInGrandPrix(props.grandPrix, driversByConstructor.value);
    notificationService.showNotification("Lista de pilotos guardada correctamente.");
    await loadDriversInGrandPrix(props.grandPrix);
  } catch (error: any) {
    notificationService.showNotification(error.message ?? "Ha ocurrido un error.", "error");
  }
}

function teamCarColor(constructor: Constructor) {
  return {
    color: invertColor(constructor.teamcolor),
    fontWeight: 'bold',
    backgroundColor: '#' + constructor.teamcolor,
  };
}

onMounted(async () => {
  try {
    const [listDrivers, listGPs] = await Promise.all([
      driversService.getDriversInSeason(props.grandPrix.season),
      grandPrixService.getGrandPrixesList(props.grandPrix.season),
    ]);

    driversInSeason.value = [...listDrivers].sort((a, b) => a.lastname.localeCompare(b.lastname));
    otherGPList.value = [...listGPs];

    await loadDriversInGrandPrix(props.grandPrix);
  } catch (error: any) {
    notificationService.showNotification(error.message ?? "Ha ocurrido un error.", "error");
  }
});
</script>
