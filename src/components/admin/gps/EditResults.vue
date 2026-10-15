<template>
  <PCard>
    <PTitle
      tag="h3"
      type="subtitle"
    >
      Resultados en {{ sessionHumanName(session) }}
    </PTitle>

    <section
      v-if="session.hasFastLap"
      class="mb-4"
    >
      <PSelect
        v-model="fastLap"
        label="Vuelta rápida"
        placeholder="Selecciona un piloto"
      >
        <option
          v-for="driver in sessionResults"
          :key="driver.id"
          :value="driver"
        >
          {{ driver.lastname }}, {{ driver.firstname }} - {{ driver.team.name }} ({{ driver.team.carname }})
        </option>
      </PSelect>

      <PDivider />
    </section>

    <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Resultados</label>
    <PrognoAlert
      v-if="!hasSavedResults"
      variant="warning"
      message="No hay resultados guardados aún"
    />
    <draggable
      :id="`results-${session.id}`"
      class="w-full select-none space-y-2"
      :list="sessionResults"
      group="results"
      item-key="id"
    >
      <template #item="{ element, index }">
        <DraggableDriverCard
          :driver="element"
          :index="index"
          show-position
        />
      </template>
    </draggable>

    <section class="flex flex-col my-4 gap-2">
      <p-checkbox
        id="notSendNotification"
        v-model="notSendNotification"
        color="danger"
      >
        NO enviar notificación
      </p-checkbox>
      <p-checkbox
        id="notOverrideGrid"
        v-model="notOverrideGrid"
        color="danger"
      >
        NO sobreescribir parrilla
      </p-checkbox>
    </section>

    <PButton
      color="primary"
      @click="saveResults()"
    >
      Guardar resultados
    </PButton>
  </PCard>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {RaceSession} from "@/types/RaceSession";
import {Driver} from "@/types/Driver";
import {grandPrixService, notificationService} from "@/_services";
import {GrandPrix} from "@/types/GrandPrix";
import DraggableDriverCard from "@/components/gps/DraggableDriverCard.vue";
import draggable from "vuedraggable";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import PTitle from "@/components/lib/PTitle.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PCard from "@/components/lib/PCard.vue";
import PCheckbox from "@/components/lib/forms/PCheckbox.vue";
import PSelect from "@/components/lib/forms/PSelect.vue";
import PDivider from "@/components/lib/PDivider.vue";
import {sessionHumanName} from "@/utils/raceSession";

const hasSavedResults = defineModel<boolean>("hasSavedResults", {default: false});

const props = defineProps<{
  grandPrix: GrandPrix;
  session: RaceSession;
  resultsInSession: Array<Driver>;
}>();

const notSendNotification = ref(false);
const notOverrideGrid = ref(false);
const fastLap = ref<Driver>({} as Driver);
const sessionResults = ref<Array<Driver>>([...props.resultsInSession]);

async function saveResults() {
  const payload = {
    results: new Map(sessionResults.value.map((driver, index) => [index + 1, driver.id])),
    notSendNotification: notSendNotification.value,
  };
  try {
    await grandPrixService.saveResults(props.grandPrix, props.session, payload);
    notificationService.showNotification("¡Has guardado los resultados!");
    hasSavedResults.value = true;
  } catch (error: any) {
    notificationService.showNotification(error.message, "error");
  }
}
</script>

<style scoped>

</style>
