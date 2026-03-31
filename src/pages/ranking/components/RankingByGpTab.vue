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
      <o-table
        :data="rows"
        hoverable
        :mobile-cards="false"
        default-sort="totalScore"
        default-sort-direction="DESC"
        :row-class="rowClass"
      >
      <o-table-column
        v-slot="slotProps"
        label="Pos."
        sortable
        numeric
      >
        <RankingPositionCell :index="slotProps.index" />
      </o-table-column>

      <o-table-column
        field="user.username"
        label="Nombre"
        sortable
      >
        <template #default="slotProps">
          <RankingUserCell
            :entry="slotProps.row"
            :community-members="communityMembers"
          />
        </template>
      </o-table-column>

      <o-table-column
        v-for="gp in grandPrixes"
        :key="gp.code"
        field="pointsInGP"
        sortable
        numeric
      >
        <template #header>
          <RankingGrandPrixHeader :gp="gp" />
        </template>
        <template #default="slotProps">
          <PointsTooltipComponent
            v-if="slotProps.row.gps.has(gp.id)"
            :gp-name="gp.name"
            :user-points="slotProps.row.gps.get(gp.id)"
            :display-points="slotProps.row.gps.get(gp.id).pointsInGP"
          />
          <template v-else>
            0 :(
          </template>

          <PTooltip
            v-if="slotProps.row.gps.get(gp.id)?.pointsInGP && checkGpWinner(gp.id, slotProps.row.gps.get(gp.id).pointsInGP)"
            :label="`Ganador de ${gp.name}`"
          >
            <span class="text-blue-500">
              <PIcon icon="fas fa-trophy" />
            </span>
          </PTooltip>
        </template>
      </o-table-column>

      <o-table-column
        v-slot="slotProps"
        field="totalScore"
        label="Total"
        sortable
        numeric
      >
        <span class="font-bold">{{ slotProps.row.totalScore }}</span>
      </o-table-column>
      </o-table>
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
import PTooltip from "@/components/lib/PTooltip.vue";
import { GrandPrix } from "@/types/GrandPrix";
import { RankingChartOptions, RankingLineSeries, TableEntry } from "@/pages/ranking/types/ranking";
import { User } from "@/types/User";
import RankingTabTemplate from "@/pages/ranking/components/RankingTabTemplate.vue";
import RankingPositionCell from "@/pages/ranking/components/RankingPositionCell.vue";
import RankingUserCell from "@/pages/ranking/components/RankingUserCell.vue";
import RankingGrandPrixHeader from "@/pages/ranking/components/RankingGrandPrixHeader.vue";
import PointsTooltipComponent from "@/pages/ranking/components/PointsTooltipComponent.vue";
import VueApexCharts from "vue3-apexcharts";

defineProps<{
  rows: TableEntry[];
  communityMembers: Map<string, User>;
  grandPrixes: GrandPrix[];
  rowClass: (row: TableEntry, index: number) => string;
  checkGpWinner: (gpId: number, score: number) => boolean;
  gpPointsSeries: RankingLineSeries;
  gpPointsChartOptions: RankingChartOptions;
  gpPointsChartRef: (el: unknown) => void;
}>();
</script>





