<template>
  <RankingTabTemplate
    label="Ranking acumulado"
    :value="1"
    title="Ranking acumulado"
    chart-title="Puntos acumulados por Gran Premio"
  >
    <template #intro>
      <p class="text-sm leading-6 text-gray-700 dark:text-gray-300">
        La puntuacion marcada en
        <PTag
          color="warning"
          size="small"
        >
          dorado
        </PTag> es la maxima acumulada para ese Gran Premio<br>
      </p>
    </template>

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

    <template #before-chart-title>
      <h1 class="mt-4 text-2xl font-semibold">
        Puntos acumulados
      </h1>
      <p class="text-sm leading-6 text-gray-700 dark:text-gray-300">
        La puntuacion marcada en
        <PTag
          color="warning"
          size="small"
        >
          dorado
        </PTag> es la maxima acumulada para ese Gran Premio<br>
      </p>
    </template>

    <template #chart>
      <VueApexCharts
        :ref="accumulatedPointsChartRef"
        height="400"
        type="line"
        :options="accumulatedPointsChartOptions"
        :series="accumulatedPointsSeries"
      />
    </template>
  </RankingTabTemplate>
</template>

<script setup lang="ts">
import PTag from "@/components/lib/PTag.vue";
import { GrandPrix } from "@/types/GrandPrix";
import { RankingChartOptions, RankingLineSeries, TableEntry } from "@/pages/ranking/types/ranking";
import { User } from "@/types/User";
import RankingTabTemplate from "@/pages/ranking/components/RankingTabTemplate.vue";
import RankingGrandPrixHeader from "@/pages/ranking/components/RankingGrandPrixHeader.vue";
import VueApexCharts from "vue3-apexcharts";
import PTable from "@/components/lib/table/PTable.vue";
import { computed, markRaw } from "vue";
import type { Column } from "@/components/lib/table";
import BoldValueFormatter from "@/components/gps/score/formatters/BoldValueFormatter.vue";
import RankingPositionFormatter from "@/pages/ranking/components/formatters/RankingPositionFormatter.vue";
import RankingUserFormatter from "@/pages/ranking/components/formatters/RankingUserFormatter.vue";
import RankingGpAccumulatedFormatter from "@/pages/ranking/components/formatters/RankingGpAccumulatedFormatter.vue";

const props = defineProps<{
  rows: TableEntry[];
  communityMembers: Map<string, User>;
  grandPrixes: GrandPrix[];
  rowClass: (row: TableEntry, index: number) => string;
  checkAccumulatedWinner: (gpId: number, score: number) => boolean;
  accumulatedPointsSeries: RankingLineSeries;
  accumulatedPointsChartOptions: RankingChartOptions;
  accumulatedPointsChartRef: (el: unknown) => void;
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
      label: 'Pos.',
      field: 'pos',
      sortable: true,
      sortKey: 'pos',
      formatter: markRaw(RankingPositionFormatter),
    },
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
      field: `gpsById.${gp.id}.accumulatedPoints`,
      sortable: true,
      sortKey: `gpsById.${gp.id}.accumulatedPoints`,
      formatter: markRaw(RankingGpAccumulatedFormatter),
      formatterProps: {
        gp,
        checkAccumulatedWinner: props.checkAccumulatedWinner,
      },
    });
  });

  cols.push({
    label: 'Total',
    field: 'totalScore',
    sortable: true,
    sortKey: 'totalScore',
    formatter: markRaw(BoldValueFormatter),
  });

  return cols;
});

const rowClassForPTable = (row: any, index: number) => {
  return props.rowClass?.(row.entry, index) || '';
};
</script>





