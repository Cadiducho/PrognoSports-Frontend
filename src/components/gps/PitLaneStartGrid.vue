<template>
  <div class="mt-2">
    <div
      v-if="hasPitLaneExits || hasGridChanges"
      class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
    >
      <div
        v-if="hasPitLaneExits"
        class="mb-2"
      >
        <h5 class="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
          Salidas desde Pit Lane
        </h5>
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <div
              v-for="pos in parrillaPitLane"
              :key="pos.driver.id + '-' + pos.position"
              class="mb-1"
            >
              <StartGridCard :grid-pos="pos" />
            </div>
          </div>
          <div class="hidden md:block" />
        </div>
      </div>

      <div
        v-if="hasGridChanges"
        class="mt-2"
      >
        <hr class="my-3 border-slate-200 dark:border-slate-700">
        <h5 class="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
          Notas sobre el cambio de la parrilla:
        </h5>
        <ul class="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
          <li
            v-for="gridPosition in parrillaNotas"
            :key="gridPosition.driver.id + '-note'"
          >
            <b>{{ gridPosition.driver.lastname }} #{{ gridPosition.driver.number }}</b>: {{ gridPosition.note }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";

import {StartGridPosition} from "@/types/StartGridPosition";
import StartGridCard from "@/components/gps/StartGridCard.vue";
import {RaceSession} from "@/types/RaceSession";

import useEmitter from "@/composables/useEmitter";

defineOptions({ name: "PitLaneStartGrid" });

const props = defineProps<{
  grid: Map<RaceSession, Array<StartGridPosition>>;
}>();

const emitter = useEmitter();
const chosenSession = ref<RaceSession | undefined>(undefined);

const parrillaSession = computed((): Array<StartGridPosition> | undefined => {
  if (!chosenSession.value) {
    return undefined;
  }
  return props.grid.get(chosenSession.value);
});

const parrillaPitLane = computed((): Array<StartGridPosition> | undefined => {
  return parrillaSession.value?.filter((gridPos) => gridPos.isFromPit);
});

const parrillaNotas = computed((): Array<StartGridPosition> | undefined => {
  return parrillaSession.value?.filter((gridPos) => gridPos.note !== undefined);
});

const hasPitLaneExits = computed(() => parrillaSession.value?.some((gridPos) => gridPos.isFromPit));
const hasGridChanges = computed(() => parrillaSession.value?.some((gridPos) => gridPos.note !== undefined));

const onChangeGridSession = (session: RaceSession) => {
  chosenSession.value = session;
};

onMounted(() => {
  chosenSession.value = props.grid.keys().next().value;
  emitter.on("changeGridSession", onChangeGridSession);
});

onUnmounted(() => {
  emitter.off("changeGridSession", onChangeGridSession);
});

defineExpose({
  chosenSession,
  parrillaSession,
  parrillaPitLane,
  parrillaNotas,
  hasPitLaneExits,
  hasGridChanges,
});
</script>
