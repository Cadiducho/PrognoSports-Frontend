<template>
  <div class="mt-6 flex flex-col gap-6">
    <section>
      <h4 class="mb-2 font-semibold text-slate-800 dark:text-slate-100">
        Posiciones por Gran Premio
      </h4>
      <PChart
        :definition="positionsChart"
        aria-label="Posición obtenida en cada Gran Premio de la temporada"
        :height="POSITIONS_CHART_HEIGHT"
      />
      <PChartLegend
        v-model="visibleKeys"
        :items="legendItems"
        aria-label="Series visibles en las gráficas"
      />
    </section>

    <section v-if="hasRaceData">
      <h4 class="mb-2 font-semibold text-slate-800 dark:text-slate-100">
        Distribución de posiciones en carrera
      </h4>
      <PChart
        :definition="distributionChart"
        aria-label="Número de veces que se terminó cada carrera en cada posición"
        :height="DISTRIBUTION_CHART_HEIGHT"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

import PChart from "@/components/lib/charts/PChart.vue";
import PChartLegend from "@/components/lib/charts/PChartLegend.vue";
import type { ChartLegendItem } from "@/components/lib/charts/types";
import {
  buildPositionDistributionChart,
  buildPositionsChart,
  DISTRIBUTION_CHART_HEIGHT,
  distributionSeries,
  POSITIONS_CHART_HEIGHT,
  type PositionSeries,
} from "@/composables/charts/resultsCharts";
import type { GrandPrix } from "@/types/GrandPrix";

defineOptions({ name: "SeasonResultsCharts" });

const props = defineProps<{
  grandPrixes: Array<GrandPrix>;
  series: Array<PositionSeries>;
}>();

const visibleKeys = ref<Array<string>>(props.series.map((line) => line.key));

// Al cambiar de temporada cambian las series: se vuelven a mostrar todas
watch(
  () => props.series.map((line) => line.key).join("|"),
  () => {
    visibleKeys.value = props.series.map((line) => line.key);
  },
);

const legendItems = computed((): Array<ChartLegendItem> => props.series.map((line) => ({
  key: line.key,
  label: line.label,
  color: line.color,
})));

const positionsChart = computed(() => buildPositionsChart({
  grandPrixes: props.grandPrixes,
  series: props.series,
  visibleKeys: visibleKeys.value,
}));

const hasRaceData = computed(() => distributionSeries(props.series, props.series.map((line) => line.key))
  .some((line) => [...line.values.values()].some((position) => typeof position === "number" && position > 0)));

const distributionChart = computed(() => buildPositionDistributionChart({
  series: props.series,
  visibleKeys: visibleKeys.value,
}));
</script>
