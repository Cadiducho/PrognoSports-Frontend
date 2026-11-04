<script setup lang="ts">
import { computed } from "vue";
import type { ProfileHighlights } from "@/composables/charts/profileStats";

const props = defineProps<{
  highlights: ProfileHighlights | null;
}>();

const format = (value: number) => value.toLocaleString("es-ES");

const tiles = computed(() => {
  const data = props.highlights;
  if (!data) {
    return [];
  }
  return [
    { label: "GPs disputados", value: format(data.gpsPlayed), detail: "esta temporada" },
    {
      label: "Mejor GP",
      value: data.bestGp ? `${format(data.bestGp.points)} pts` : "—",
      detail: data.bestGp?.gpName ?? "Sin puntos todavía",
    },
    {
      label: "Mejor posición",
      value: data.bestPosition ? `${data.bestPosition.standings}º` : "—",
      detail: data.bestPosition ? `tras ${data.bestPosition.gpCode}` : "Sin clasificación",
    },
    {
      label: "Media por GP",
      value: data.averagePointsPerGp === null ? "—" : `${format(data.averagePointsPerGp)} pts`,
      detail: "puntos por Gran Premio",
    },
    {
      label: "Acierto medio",
      value: data.averageHitPercentage === null ? "—" : `${format(data.averageHitPercentage)}%`,
      detail: "de las predicciones",
    },
  ];
});
</script>

<template>
  <div>
    <ul
      v-if="tiles.length > 0"
      class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
    >
      <li
        v-for="tile in tiles"
        :key="tile.label"
        class="min-w-0 rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-800"
      >
        <span class="block text-xs uppercase tracking-tight text-gray-600 dark:text-gray-400">
          {{ tile.label }}
        </span>
        <strong class="block truncate text-xl text-gray-900 dark:text-gray-100">{{ tile.value }}</strong>
        <span class="block truncate text-xs text-gray-600 dark:text-gray-400">{{ tile.detail }}</span>
      </li>
    </ul>
  </div>
</template>
