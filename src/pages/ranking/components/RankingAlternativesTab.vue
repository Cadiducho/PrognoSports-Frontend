<template>
  <PTitle
    type="subtitle"
    class="mb-1"
  >
    Rankings alternativos
  </PTitle>
  <p class="mb-4 text-sm text-gray-600 dark:text-gray-300">
    ¿Quién ganaría si solo contara una sesión?
  </p>

  <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <AlternativeRankingCard
      v-for="ranking in rankings"
      :key="ranking.key"
      :ranking="ranking"
      :community-members="communityMembers"
      :current-username="currentUsername"
    />
  </div>
  <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
    Flechas: puestos que se ganan o pierden frente a la clasificación real.
  </p>

  <div class="mt-8">
    <RankingHitsTab
      :rows="hitsRows"
      :community-members="communityMembers"
      :grand-prixes="grandPrixes"
      :row-class="rowClass"
      :check-max-hits="checkMaxHits"
      :hits-heatmap-chart="hitsHeatmapChart"
      :hits-heatmap-chart-height="hitsHeatmapChartHeight"
    />
  </div>
</template>

<script setup lang="ts">
import type { ChartDefinition } from "@tanstack/charts";
import { GrandPrix } from "@/types/GrandPrix";
import { User } from "@/types/User";
import PTitle from "@/components/lib/PTitle.vue";
import { AlternativeRanking, TableEntry } from "@/pages/ranking/types/ranking";
import AlternativeRankingCard from "@/pages/ranking/components/AlternativeRankingCard.vue";
import RankingHitsTab from "@/pages/ranking/components/RankingHitsTab.vue";

defineProps<{
  rankings: AlternativeRanking[];
  currentUsername: string;
  communityMembers: Map<string, User>;
  grandPrixes: GrandPrix[];
  hitsRows: TableEntry[];
  rowClass: (row: TableEntry, index: number) => string;
  checkMaxHits: (gpId: number, hits: number) => boolean;
  hitsHeatmapChart: ChartDefinition;
  hitsHeatmapChartHeight: number;
}>();
</script>
