<template>
  <div>
    <PCard
      v-if="grid !== undefined"
    >
      <nav class="flex flex-col">
        <PTitle type="subtitle">
          Parrilla de Salida
        </PTitle>

        <PField
          v-if="chosenSession && availableSessions.length > 1"
          label="Sesión"
        >
          <PSelect
            v-model="chosenSession"
            placeholder="Selecciona la sesión"
            @change="changeGridSession()"
          >
            <option
              v-for="session in availableSessions"
              :key="session.id"
              :value="session"
            >
              {{ session.humanName() }}
            </option>
          </PSelect>
        </PField>
      </nav>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <div
            v-for="pos in parrillaIzquierda"
            :key="pos.driver.id + '-' + pos.position"
            class="mb-4"
          >
            <StartGridCard :grid-pos="pos" />
          </div>
        </div>

        <div>
          <div
            v-for="pos in parrillaDerecha"
            :key="pos.driver.id + '-' + pos.position"
            class="mt-4"
          >
            <StartGridCard :grid-pos="pos" />
          </div>
        </div>
      </div>
    </PCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import {StartGridPosition} from "@/types/StartGridPosition";
import StartGridCard from "@/components/gps/StartGridCard.vue";
import {RaceSession} from "@/types/RaceSession";

import useEmitter from "@/composables/useEmitter";
import dayjs from "dayjs";
import PTitle from "@/components/lib/PTitle.vue";
import PField from "@/components/lib/forms/PField.vue";
import PSelect from "@/components/lib/forms/PSelect.vue";
import PCard from "@/components/lib/PCard.vue";

defineOptions({ name: "StartGridList" });

const props = defineProps<{
  grid: Map<RaceSession, Array<StartGridPosition>>;
}>();

const emitter = useEmitter();
const chosenSession = ref<RaceSession | undefined>(undefined);
const availableSessions = ref<Array<RaceSession>>([]);

const parrillaIzquierda = computed((): Array<StartGridPosition> => {
  if (!chosenSession.value) {
    return [];
  }
  return props.grid.get(chosenSession.value)?.filter((gridPos) => gridPos.position % 2 !== 0 && !gridPos.isFromPit) ?? [];
});

const parrillaDerecha = computed((): Array<StartGridPosition> => {
  if (!chosenSession.value) {
    return [];
  }
  return props.grid.get(chosenSession.value)?.filter((gridPos) => gridPos.position % 2 === 0 && !gridPos.isFromPit) ?? [];
});

function changeGridSession(): void {
  if (chosenSession.value) {
    emitter.emit("changeGridSession", chosenSession.value);
  }
}

onMounted(() => {
  availableSessions.value = Array.from(props.grid.keys());
  chosenSession.value = availableSessions.value[0];

  const sessionOfToday = availableSessions.value.find((ses) => dayjs(ses.date).isToday());
  if (sessionOfToday) {
    chosenSession.value = sessionOfToday;
  }
});

defineExpose({ chosenSession, availableSessions, parrillaIzquierda, parrillaDerecha, changeGridSession });
</script>

