<template>
  <ul class="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
    <StatTile
      label="Grandes Premios"
      :value="stats.gps"
    />
    <StatTile
      label="Victorias"
      :value="stats.wins"
    />
    <StatTile
      label="Podios"
      :value="stats.podiums"
    />
    <StatTile
      label="Top 10"
      :value="stats.top10"
    />
    <StatTile
      label="Poles"
      :value="stats.poles"
    />
    <StatTile
      label="Victorias sprint"
      :value="stats.sprintWins"
    />
    <StatTile
      label="Mejor resultado"
      :value="formatPosition(stats.bestFinish)"
    />
    <StatTile
      label="Posición media"
      :value="formatAverage(stats.averageFinish)"
    />
  </ul>
</template>

<script setup lang="ts">
import StatTile from "@/components/stats/StatTile.vue";
import { formatAverage, formatPosition, type StatLine } from "@/composables/useSeasonResults";

defineOptions({ name: "StatsGrid" });

defineProps<{
  stats: StatLine;
}>();
</script>
