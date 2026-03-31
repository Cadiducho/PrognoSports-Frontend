<template>
  <div id="rankingComponent">
    <PTitle name="Ranking" />

    <PCard>
      <nav class="block flex justify-between">
        <PField label="Temporada">
          <PSelect
            v-if="chosenSeason"
            v-model="chosenSeason"
            placeholder="Selecciona la temporada"
            @change="changeSeason"
          >
            <option
              v-for="season in orderedSeasonList"
              :key="season.id"
              :value="season"
            >
              {{ season.competition.name }} {{ season.name }}
            </option>
          </PSelect>
        </PField>
      </nav>

      <loading v-if="isLoading" />
      <template v-else>
        <PrognoAlert
          v-if="!tableHasData"
          variant="danger"
        >
          No hay datos de esta temporada
        </PrognoAlert>

        <o-tabs
          v-else
          v-model="activeTab"
        >
          <RankingByGpTab
            :rows="byGpRows"
            :community-members="communityMembers"
            :grand-prixes="grandPrixesWithPoints"
            :row-class="checkRowClass"
            :check-gp-winner="checkGpWinner"
            :gp-points-series="gpPointsSeries"
            :gp-points-chart-options="gpPointsChartOptions"
            :gp-points-chart-ref="setGpPointsChartRef"
          />

          <RankingAccumulatedTab
            :rows="accumulatedRows"
            :community-members="communityMembers"
            :grand-prixes="grandPrixesWithPoints"
            :row-class="checkRowClass"
            :check-accumulated-winner="checkAccumulatedWinner"
            :accumulated-points-series="accumulatedPointsSeries"
            :accumulated-points-chart-options="accumulatedPointsChartOptions"
            :accumulated-points-chart-ref="setAccumulatedPointsChartRef"
          />

          <RankingHitsTab
            :rows="hitsRows"
            :community-members="communityMembers"
            :grand-prixes="grandPrixesWithPoints"
            :row-class="checkRowClass"
            :check-max-hits="checkMaxHits"
            :hits-heatmap-series="hitsHeatmapSeries"
            :hits-heatmap-options="hitsHeatmapOptions"
            :hits-heatmap-chart-ref="setHitsHeatmapChartRef"
          />

          <RankingStandingsTab
            :rows="accumulatedRows"
            :community-members="communityMembers"
            :grand-prixes="grandPrixesWithPoints"
            :row-class="checkRowClass"
            :standings-series="standingsSeries"
            :standings-chart-options="standingsChartOptions"
            :standings-chart-ref="setStandingsChartRef"
          />
        </o-tabs>
      </template>
    </PCard>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/authStore";
import { useCommunityStore } from "@/store/communityStore";
import { useThemeStore } from "@/store/themeStore";
import PTitle from "@/components/lib/PTitle.vue";
import PCard from "@/components/lib/PCard.vue";
import PField from "@/components/lib/forms/PField.vue";
import PSelect from "@/components/lib/forms/PSelect.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import RankingByGpTab from "@/pages/ranking/components/RankingByGpTab.vue";
import RankingAccumulatedTab from "@/pages/ranking/components/RankingAccumulatedTab.vue";
import RankingHitsTab from "@/pages/ranking/components/RankingHitsTab.vue";
import RankingStandingsTab from "@/pages/ranking/components/RankingStandingsTab.vue";
import { TableEntry } from "@/pages/ranking/types/ranking";
import { useRankingData } from "@/pages/ranking/composables/useRankingData";
import { useRankingCharts } from "@/pages/ranking/composables/useRankingCharts";
import { isApexChartInstance } from "@/composables/useApexChart";

const authStore = useAuthStore();
const communityStore = useCommunityStore();
const themeStore = useThemeStore();

const currentUser = authStore.loggedUser;
const { currentCommunity } = storeToRefs(communityStore);
const { darkMode } = storeToRefs(themeStore);

const {
  activeTab,
  isLoading,
  tableHasData,
  orderedSeasonList,
  chosenSeason,
  communityMembers,
  byGpRows,
  accumulatedRows,
  hitsRows,
  grandPrixesWithPoints,
  gpPointsSeries,
  accumulatedPointsSeries,
  standingsSeries,
  hitsHeatmapSeries,
  loadRanking,
  checkGpWinner,
  checkAccumulatedWinner,
  checkMaxHits,
} = useRankingData(currentCommunity);

const {
  gpPointsChartRef,
  accumulatedPointsChartRef,
  hitsHeatmapChartRef,
  standingsChartRef,
  gpPointsChartOptions,
  accumulatedPointsChartOptions,
  standingsChartOptions,
  hitsHeatmapOptions,
} = useRankingCharts(darkMode, grandPrixesWithPoints);

const setGpPointsChartRef = (chart: unknown) => {
  gpPointsChartRef.value = isApexChartInstance(chart) ? chart : null;
};

const setAccumulatedPointsChartRef = (chart: unknown) => {
  accumulatedPointsChartRef.value = isApexChartInstance(chart) ? chart : null;
};

const setHitsHeatmapChartRef = (chart: unknown) => {
  hitsHeatmapChartRef.value = isApexChartInstance(chart) ? chart : null;
};

const setStandingsChartRef = (chart: unknown) => {
  standingsChartRef.value = isApexChartInstance(chart) ? chart : null;
};

const checkRowClass = (row: TableEntry, _index: number) => {
  if (row.user.username === currentUser.username) {
    return "bg-brand-accent-500 text-white hover:!text-white dark:bg-brand-600";
  }
  return "";
};

const changeSeason = async () => {
  if (!chosenSeason.value) {
    return;
  }
  await loadRanking(chosenSeason.value);
};
</script>

