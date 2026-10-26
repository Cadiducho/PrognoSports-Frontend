<template>
  <PPage>
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

      <PTabs
        v-else
        v-model="activeTab"
      >
        <template #tabs>
          <PTabItem
            name="byGp"
            label="Ranking por Gran Premio"
          />
          <PTabItem
            name="accumulated"
            label="Ranking acumulado"
          />
          <PTabItem
            name="byHits"
            label="Ranking por aciertos"
          />
          <PTabItem
            name="byRanking"
            label="Ranking por clasificacion"
          />
        </template>
        <PTabPanel name="byGp">
          <RankingByGpTab
            v-model:visible-users="visibleUsers"
            :rows="byGpRows"
            :community-members="communityMembers"
            :grand-prixes="grandPrixesWithPoints"
            :row-class="checkRowClass"
            :check-gp-winner="checkGpWinner"
            :gp-points-chart="gpPointsChart"
            :legend-items="legendItems"
          />
        </PTabPanel>
        <PTabPanel name="accumulated">
          <RankingAccumulatedTab
            v-model:visible-users="visibleUsers"
            v-model:mode="accumulatedMode"
            :can-compare-with-me="canCompareWithMe"
            :rows="accumulatedRows"
            :community-members="communityMembers"
            :grand-prixes="grandPrixesWithPoints"
            :row-class="checkRowClass"
            :check-accumulated-winner="checkAccumulatedWinner"
            :accumulated-points-chart="accumulatedPointsChart"
            :legend-items="legendItems"
          />
        </PTabPanel>
        <PTabPanel name="byHits">
          <RankingHitsTab
            :rows="hitsRows"
            :community-members="communityMembers"
            :grand-prixes="grandPrixesWithPoints"
            :row-class="checkRowClass"
            :check-max-hits="checkMaxHits"
            :hits-heatmap-chart="hitsHeatmapChart"
            :hits-heatmap-chart-height="hitsHeatmapChartHeight"
          />
        </PTabPanel>
        <PTabPanel name="byRanking">
          <RankingStandingsTab
            v-model:visible-users="visibleUsers"
            :rows="accumulatedRows"
            :community-members="communityMembers"
            :grand-prixes="grandPrixesWithPoints"
            :row-class="checkRowClass"
            :standings-chart="standingsChart"
            :legend-items="legendItems"
          />
        </PTabPanel>
      </PTabs>
    </template>
  </PPage>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/authStore";
import { useCommunityStore } from "@/store/communityStore";
import PField from "@/components/lib/forms/PField.vue";
import PSelect from "@/components/lib/forms/PSelect.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import RankingByGpTab from "@/pages/ranking/components/RankingByGpTab.vue";
import RankingAccumulatedTab from "@/pages/ranking/components/RankingAccumulatedTab.vue";
import RankingHitsTab from "@/pages/ranking/components/RankingHitsTab.vue";
import RankingStandingsTab from "@/pages/ranking/components/RankingStandingsTab.vue";
import PTabPanel from "@/components/lib/PTabPanel.vue";
import { TableEntry } from "@/pages/ranking/types/ranking";
import type { AccumulatedMode } from "@/composables/charts/accumulatedView";
import { useRankingData } from "@/pages/ranking/composables/useRankingData";
import { useRankingCharts } from "@/pages/ranking/composables/useRankingCharts";
import PTabs from "@/components/lib/PTabs.vue";
import PTabItem from "@/components/lib/PTabItem.vue";

const authStore = useAuthStore();
const communityStore = useCommunityStore();

const currentUser = authStore.loggedUser;
const { currentCommunity } = storeToRefs(communityStore);

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
  rankedUsernames,
  topScorerUsers,
  gpPointsData,
  accumulatedPointsData,
  standingsData,
  hitsCells,
  loadRanking,
  checkGpWinner,
  checkAccumulatedWinner,
  checkMaxHits,
} = useRankingData(currentCommunity);

// Usuarios visibles en las gráficas de líneas: se comparten entre pestañas y arrancan con el top 8
const visibleUsers = ref<string[]>([]);
watch(topScorerUsers, (topScorers) => {
  visibleUsers.value = [...topScorers];
}, { immediate: true });

// Los puntos acumulados solo suben y apelotonan las líneas: por defecto se dibuja la diferencia con el líder
const accumulatedMode = ref<AccumulatedMode>("leader");

const {
  legendItems,
  canCompareWithMe,
  gpPointsChart,
  accumulatedPointsChart,
  standingsChart,
  hitsHeatmapChart,
  hitsHeatmapChartHeight,
} = useRankingCharts({
  grandPrixes: grandPrixesWithPoints,
  rankedUsernames,
  visibleUsers,
  accumulatedMode,
  currentUsername: currentUser.username,
  gpPointsData,
  accumulatedPointsData,
  standingsData,
  hitsCells,
});

// Si en otra temporada no apareces en el ranking, no hay con qué compararte
watch(canCompareWithMe, (canCompare) => {
  if (!canCompare && accumulatedMode.value === "me") {
    accumulatedMode.value = "leader";
  }
});

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

