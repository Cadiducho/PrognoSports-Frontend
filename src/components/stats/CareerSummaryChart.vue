<template>
  <section class="mt-6">
    <h4 class="mb-2 font-semibold text-slate-800 dark:text-slate-100">
      Resumen por temporada
    </h4>
    <PChart
      :definition="chart"
      aria-label="Victorias, podios y poles en cada temporada"
      :height="CAREER_CHART_HEIGHT"
    />
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";

import PChart from "@/components/lib/charts/PChart.vue";
import { buildCareerSummaryChart, CAREER_CHART_HEIGHT, type CareerSeason } from "@/composables/charts/resultsCharts";

defineOptions({ name: "CareerSummaryChart" });

const props = defineProps<{
  /** Temporadas en orden cronológico */
  seasons: Array<CareerSeason>;
}>();

const chart = computed(() => buildCareerSummaryChart(props.seasons));
</script>
