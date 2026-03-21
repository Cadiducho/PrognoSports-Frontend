<template>
  <RankingTabTemplate
    label="Ranking por clasificacion"
    :value="3"
    title="Clasificaciones"
    chart-title="Clasificacion por Gran Premio"
  >
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
              v-if="slotProps.row.gps.get(gp.id).standings === 1"
              color="warning"
              size="small"
            >
              {{ slotProps.row.gps.get(gp.id).standings }}
            </PTag>
            <template v-else>
              <template v-if="slotProps.row.gps.get(gp.id).standings >= 1">
                {{ slotProps.row.gps.get(gp.id).standings }}
              </template>
              <template v-else>
                --
              </template>
            </template>
          </template>
          <template v-else>
            :(
          </template>
        </template>
      </o-table-column>
      </o-table>
    </template>

    <template #chart>
      <VueApexCharts
        :ref="standingsChartRef"
        height="400"
        type="line"
        :options="standingsChartOptions"
        :series="standingsSeries"
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
import RankingUserCell from "@/pages/ranking/components/RankingUserCell.vue";
import RankingGrandPrixHeader from "@/pages/ranking/components/RankingGrandPrixHeader.vue";
import VueApexCharts from "vue3-apexcharts";

defineProps<{
  rows: TableEntry[];
  communityMembers: Map<string, User>;
  grandPrixes: GrandPrix[];
  rowClass: (row: TableEntry, index: number) => string;
  standingsSeries: RankingLineSeries;
  standingsChartOptions: RankingChartOptions;
  standingsChartRef: (el: unknown) => void;
}>();
</script>





