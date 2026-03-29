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
        :field="gp.code"
        sortable
        numeric
      >
        <template #header>
          <RankingGrandPrixHeader :gp="gp" />
        </template>
        <template #default="slotProps">
          <template v-if="slotProps.row.gps.has(gp.id)">
            <PTag
              v-if="checkAccumulatedWinner(gp.id, slotProps.row.gps.get(gp.id).accumulatedPoints)"
              color="warning"
              size="small"
            >
              <PointsTooltipComponent
                :gp-name="gp.name"
                :user-points="slotProps.row.gps.get(gp.id)"
                :display-points="slotProps.row.gps.get(gp.id).accumulatedPoints"
              />
            </PTag>
            <template v-else>
              <PointsTooltipComponent
                :gp-name="gp.name"
                :user-points="slotProps.row.gps.get(gp.id)"
                :display-points="slotProps.row.gps.get(gp.id).accumulatedPoints"
              />
            </template>
          </template>
          <template v-else>
            0 :(
          </template>
        </template>
      </o-table-column>
      </o-table>
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
  checkAccumulatedWinner: (gpId: number, score: number) => boolean;
  accumulatedPointsSeries: RankingLineSeries;
  accumulatedPointsChartOptions: RankingChartOptions;
  accumulatedPointsChartRef: (el: unknown) => void;
}>();
</script>





