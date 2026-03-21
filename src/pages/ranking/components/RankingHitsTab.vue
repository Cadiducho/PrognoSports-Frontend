<template>
  <RankingTabTemplate
    label="Ranking por aciertos"
    :value="2"
    title="Aciertos"
    chart-title="Aciertos por Gran Premio"
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
              v-if="checkMaxHits(gp.id, slotProps.row.gps.get(gp.id).hitsInGP)"
              color="warning"
              size="small"
            >
              <HitsTooltipComponent
                :gp-name="gp.name"
                :user-points="slotProps.row.gps.get(gp.id)"
              />
            </PTag>
            <template v-else>
              <template v-if="slotProps.row.gps.get(gp.id).hitsInGP >= 0">
                <HitsTooltipComponent
                  :gp-name="gp.name"
                  :user-points="slotProps.row.gps.get(gp.id)"
                />
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
        :ref="hitsHeatmapChartRef"
        height="400"
        type="heatmap"
        :options="hitsHeatmapOptions"
        :series="hitsHeatmapSeries"
      />
    </template>
  </RankingTabTemplate>
</template>

<script setup lang="ts">
import PTag from "@/components/lib/PTag.vue";
import { GrandPrix } from "@/types/GrandPrix";
import { RankingChartOptions, RankingHeatmapSeries, TableEntry } from "@/pages/ranking/types/ranking";
import { User } from "@/types/User";
import RankingTabTemplate from "@/pages/ranking/components/RankingTabTemplate.vue";
import RankingUserCell from "@/pages/ranking/components/RankingUserCell.vue";
import RankingGrandPrixHeader from "@/pages/ranking/components/RankingGrandPrixHeader.vue";
import HitsTooltipComponent from "@/pages/ranking/components/HitsTooltipComponent.vue";
import VueApexCharts from "vue3-apexcharts";

defineProps<{
  rows: TableEntry[];
  communityMembers: Map<string, User>;
  grandPrixes: GrandPrix[];
  rowClass: (row: TableEntry, index: number) => string;
  checkMaxHits: (gpId: number, hits: number) => boolean;
  hitsHeatmapSeries: RankingHeatmapSeries;
  hitsHeatmapOptions: RankingChartOptions;
  hitsHeatmapChartRef: (el: unknown) => void;
}>();
</script>





