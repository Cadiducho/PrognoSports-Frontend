<template>
  <PCard>
    <PTitle
      tag="h3"
      type="subtitle"
    >
      Parrilla de salida para {{ sessionHumanName(session) }}
    </PTitle>

    <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Parrilla</label>
    <PrognoAlert
      v-if="!hasSavedGrid"
      variant="warning"
      message="No hay parrilla guardada aún"
    />

    <draggable
      :id="`grid-${session.id}`"
      class="w-full select-none space-y-2"
      :list="sessionGrid"
      group="grid"
      item-key="id"
    >
      <template #item="{ element, index }">
        <DraggableDriverCard
          :driver="element.driver"
          :index="index"
          show-position
        />
      </template>
    </draggable>

    <p-button
      color="success"
      class="mt-2"
      @click="saveGrid()"
    >
      Guardar parrilla
    </p-button>
  </PCard>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {RaceSession} from "@/types/RaceSession";
import {GrandPrix} from "@/types/GrandPrix";
import DraggableDriverCard from "@/components/gps/DraggableDriverCard.vue";
import draggable from "vuedraggable";
import {StartGridPosition} from "@/types/StartGridPosition";
import {grandPrixService, notificationService} from "@/_services";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import PCard from "@/components/lib/PCard.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PTitle from "@/components/lib/PTitle.vue";
import {sessionHumanName} from "@/utils/raceSession";

const hasSavedGrid = defineModel<boolean>("hasSavedGrid", {default: false});

const props = defineProps<{
  grandPrix: GrandPrix;
  session: RaceSession;
  grid: Array<StartGridPosition>;
}>();

const sessionGrid = ref<Array<StartGridPosition>>([...props.grid]);

async function saveGrid() {
  const payload = {
    grid: sessionGrid.value.map((gridPosition, index) => ({
      driver: gridPosition.driver.id,
      isFromPit: gridPosition.isFromPit,
      note: gridPosition.note,
      position: index + 1,
    })),
  };

  try {
    await grandPrixService.saveGrid(props.grandPrix, props.session, payload);
    notificationService.showNotification("¡Has guardado la parrilla!");
    hasSavedGrid.value = true;
  } catch (error: any) {
    notificationService.showNotification(error.message, "error");
  }
}
</script>
