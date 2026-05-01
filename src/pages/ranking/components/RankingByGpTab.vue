<template>
  <RankingTabTemplate
    label="Ranking por Gran Premio"
    :value="0"
    title="Ranking por Gran Premio"
    chart-title="Puntos por Gran Premio"
  >
    <template #intro>
      <p class="text-sm leading-6 text-gray-700 dark:text-gray-300">
        Los ganadores de cada Gran Premio tendran representado un <PIcon icon="fas fa-trophy" />
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

    <template #chart>
      <VueApexCharts
        :ref="gpPointsChartRef"
        height="400"
        type="line"
        :options="gpPointsChartOptions"
        :series="gpPointsSeries"
      />
    </template>
  </RankingTabTemplate>
</template>

<script setup lang="ts">
import PIcon from "@/components/lib/PIcon.vue";
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
import RankingGpPointsFormatter from "@/pages/ranking/components/formatters/RankingGpPointsFormatter.vue";

const props = defineProps<{
  rows: TableEntry[];
  communityMembers: Map<string, User>;
  grandPrixes: GrandPrix[];
  rowClass: (row: TableEntry, index: number) => string;
  checkGpWinner: (gpId: number, score: number) => boolean;
  gpPointsSeries: RankingLineSeries;
  gpPointsChartOptions: RankingChartOptions;
  gpPointsChartRef: (el: unknown) => void;
}>();

// Transform rows to a shape convenient for PTable: we keep the original entry in `entry`
// and normalize Map-based gps into a plain object (gpsById) so PTable can access it by dot-path.
const rowsForTable = computed(() => {
  return props.rows.map((r: TableEntry, idx: number) => {
    const gpsById: Record<number, any> = {};
    props.grandPrixes.forEach((gp: GrandPrix) => {
      gpsById[gp.id] = r.gps?.get(gp.id);
    });

    return {
      // keep original structure accessible
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
      field: `gpsById.${gp.id}.pointsInGP`,
      sortable: true,
      sortKey: `gpsById.${gp.id}.pointsInGP`,
      formatter: markRaw(RankingGpPointsFormatter),
      formatterProps: {
        gp,
        checkGpWinner: props.checkGpWinner,
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

// Adapter for rowClass: original rowClass expects TableEntry; provide original entry
const rowClassForPTable = (row: any, index: number) => {
  return props.rowClass?.(row.entry, index) || '';
};
</script>





