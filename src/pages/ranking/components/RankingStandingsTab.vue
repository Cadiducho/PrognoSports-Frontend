<template>
  <RankingTabTemplate
    label="Ranking por clasificacion"
    :value="3"
    title="Clasificaciones"
    chart-title="Clasificacion por Gran Premio"
  >
    <template #table>
      <PTable
        :columns="columns"
        :rows="rowsForTable"
        :row-class="rowClassForPTable"
        row-key="user.username"
        default-sort-field="totalScore"
        default-sort-direction="DESC"
      />
    </template>

    <template #chart>
      <PChart
        :definition="standingsChart"
        aria-label="Posición de cada usuario en la clasificación tras cada Gran Premio"
        :height="LINE_CHART_HEIGHT"
      />
      <PChartLegend
        v-model="visibleUsers"
        :items="legendItems"
        aria-label="Usuarios visibles en la gráfica"
      />
    </template>
  </RankingTabTemplate>
</template>

<script setup lang="ts">
import { GrandPrix } from "@/types/GrandPrix";
import type { ChartDefinition } from "@tanstack/charts";
import { TableEntry } from "@/pages/ranking/types/ranking";
import { User } from "@/types/User";
import RankingTabTemplate from "@/pages/ranking/components/RankingTabTemplate.vue";
import RankingGrandPrixHeader from "@/pages/ranking/components/RankingGrandPrixHeader.vue";
import PChart from "@/components/lib/charts/PChart.vue";
import { LINE_CHART_HEIGHT } from "@/composables/charts/userLinesChart";
import PChartLegend from "@/components/lib/charts/PChartLegend.vue";
import type { ChartLegendItem } from "@/components/lib/charts/types";
import PTable from "@/components/lib/table/PTable.vue";
import { computed, markRaw } from "vue";
import type { Column } from "@/components/lib/table";
import RankingUserFormatter from "@/pages/ranking/components/formatters/RankingUserFormatter.vue";
import RankingGpStandingsFormatter from "@/pages/ranking/components/formatters/RankingGpStandingsFormatter.vue";

const visibleUsers = defineModel<string[]>("visibleUsers", { required: true });

const props = defineProps<{
  rows: TableEntry[];
  communityMembers: Map<string, User>;
  grandPrixes: GrandPrix[];
  rowClass: (row: TableEntry, index: number) => string;
  standingsChart: ChartDefinition;
  legendItems: ChartLegendItem[];
}>();

const rowsForTable = computed(() => {
  return props.rows.map((r: TableEntry, idx: number) => {
    const gpsById: Record<number, any> = {};
    props.grandPrixes.forEach((gp: GrandPrix) => {
      gpsById[gp.id] = r.gps?.get(gp.id);
    });

    return {
      entry: r,
      user: r.user,
      totalScore: r.totalScore,
      pos: idx + 1,
      gpsById,
    };
  });
});

const columns = computed<Column[]>(() => {
  const cols: Column[] = [
    {
      label: 'Nombre',
      field: 'user.username',
      sortable: true,
      formatter: markRaw(RankingUserFormatter),
      formatterProps: {
        communityMembers: props.communityMembers,
      },
    },
  ];

  props.grandPrixes.forEach((gp: GrandPrix) => {
    cols.push({
      label: gp.code,
      headerFormatter: markRaw(RankingGrandPrixHeader),
      headerFormatterProps: { gp },
      field: `gpsById.${gp.id}.standings`,
      sortable: true,
      sortKey: `gpsById.${gp.id}.standings`,
      formatter: markRaw(RankingGpStandingsFormatter),
      formatterProps: {
        gp,
      },
    });
  });

  return cols;
});

const rowClassForPTable = (row: any, index: number) => {
  return props.rowClass?.(row.entry, index) || '';
};
</script>





