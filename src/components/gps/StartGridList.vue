<template>
  <div>
    <div>
      <div class="grid grid-cols-2 gap-3">
        <div class="flex flex-col gap-3">
          <StartGridCard
            v-for="pos in parrillaIzquierda"
            :key="pos.driver.id + '-' + pos.position"
            :grid-pos="pos"
            selectable
            :selected="selectedDriverId === pos.driver.id"
            @select="selectedDriverId = pos.driver.id"
          />
        </div>

        <div class="flex flex-col gap-3 pt-7">
          <StartGridCard
            v-for="pos in parrillaDerecha"
            :key="pos.driver.id + '-' + pos.position"
            :grid-pos="pos"
            selectable
            :selected="selectedDriverId === pos.driver.id"
            @select="selectedDriverId = pos.driver.id"
          />
        </div>
      </div>

      <section
        v-if="pitLane.length"
        class="mt-4"
      >
        <div class="mb-3 flex items-center gap-2">
          <span
            class="w-4 border-t-2 border-info-300 dark:border-info-700"
            aria-hidden="true"
          />
          <h3 class="text-xs font-bold uppercase tracking-wide text-info-700 dark:text-info-300">
            Desde pit lane
          </h3>
          <span
            class="flex-1 border-t-2 border-info-100 dark:border-info-900"
            aria-hidden="true"
          />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <StartGridCard
            v-for="pos in pitLane"
            :key="pos.driver.id + '-pit'"
            :grid-pos="pos"
            selectable
            :selected="selectedDriverId === pos.driver.id"
            @select="selectedDriverId = pos.driver.id"
          />
        </div>
      </section>

      <GridDriverDetail
        v-if="selectedPosition"
        class="mt-2"
        :grid-pos="selectedPosition"
        :origin="origins.get(selectedPosition.driver.id)"
        :origin-name="originSession?.humanName()"
        @close="selectedDriverId = undefined"
      />
      <p
        v-else
        class="mt-2 text-center text-xs text-gray-500 dark:text-gray-400"
      >
        Pulsa un piloto para ver el detalle de su salida
      </p>

      <GridChangesList
        class="mt-4"
        :grid="sessionGrid"
        :origins="origins"
        :origin-name="originSession?.humanName()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

import {StartGridPosition} from "@/types/StartGridPosition";
import StartGridCard from "@/components/gps/StartGridCard.vue";
import GridDriverDetail from "@/components/gps/GridDriverDetail.vue";
import GridChangesList from "@/components/gps/GridChangesList.vue";
import {RaceSession} from "@/types/RaceSession";
import {GrandPrix} from "@/types/GrandPrix";
import {grandPrixService} from "@/_services";

defineOptions({ name: "StartGridList" });

const props = defineProps<{
  /** Sesión a la que pertenece la parrilla (la gobierna el selector de sesiones de la página) */
  session: RaceSession;
  grid: Array<StartGridPosition>;
  /** Con el Gran Premio se muestra la posición que tenía cada piloto en la sesión que define la parrilla */
  grandPrix?: GrandPrix;
}>();

const selectedDriverId = ref<string>();
const origins = ref<Map<string, number>>(new Map());

const sessionGrid = computed((): Array<StartGridPosition> => props.grid);

const parrillaIzquierda = computed((): Array<StartGridPosition> => {
  return sessionGrid.value.filter((gridPos) => gridPos.position % 2 !== 0 && !gridPos.isFromPit);
});

const parrillaDerecha = computed((): Array<StartGridPosition> => {
  return sessionGrid.value.filter((gridPos) => gridPos.position % 2 === 0 && !gridPos.isFromPit);
});

const pitLane = computed((): Array<StartGridPosition> => {
  return sessionGrid.value.filter((gridPos) => gridPos.isFromPit);
});

const selectedPosition = computed(() => sessionGrid.value.find((gridPos) => gridPos.driver.id === selectedDriverId.value));

// La sesión cuyos resultados definen la parrilla elegida
const originSession = computed(() => {
  return props.grandPrix?.sessions.find((session) => session.defineGridOf?.some((defined) => defined.id === props.session.id));
});

async function loadOrigins() {
  origins.value = new Map();
  if (!props.grandPrix || !originSession.value) {
    return;
  }
  try {
    const results = await grandPrixService.getResults(props.grandPrix, originSession.value);
    origins.value = new Map(results.map((result) => [result.driver.id, result.position]));
  } catch {
    // Sin la posición de origen solo se muestra la de salida
  }
}

watch(() => props.session, () => {
  selectedDriverId.value = undefined;
  loadOrigins();
}, { immediate: true });

defineExpose({ parrillaIzquierda, parrillaDerecha, pitLane });
</script>
