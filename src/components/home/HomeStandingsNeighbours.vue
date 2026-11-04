<script setup lang="ts">
import { formatDelta } from "@/composables/charts/accumulatedView";
import type { NeighbourRow } from "@/composables/charts/homeSeason";
import PCard from "@/components/lib/PCard.vue";

defineProps<{
  rows: readonly NeighbourRow[];
}>();

/** Diferencia con el usuario: `+12` si va por delante, `−8` si va por detrás; vacío en tu fila o si empatáis */
const gapText = (row: NeighbourRow) => (row.isMe || row.gap === 0 ? "" : formatDelta(row.gap));
</script>

<template>
  <PCard title="Tu entorno en el ranking">
    <ol class="flex flex-col gap-1">
      <li
        v-for="row in rows"
        :key="row.username"
        class="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm"
        :class="row.isMe ? 'bg-brand-50 dark:bg-brand-900/40' : ''"
        :aria-current="row.isMe ? 'true' : undefined"
      >
        <span class="w-6 font-bold">{{ row.position }}</span>
        <span
          class="min-w-0 flex-1 truncate"
          :class="row.isMe ? 'font-bold' : 'font-medium'"
        >
          {{ row.isMe ? "Tú" : row.username }}
        </span>
        <span class="text-xs text-gray-600 dark:text-gray-400">{{ gapText(row) }}</span>
        <span class="w-14 text-right font-semibold tabular-nums">{{ row.accumulated.toLocaleString("es-ES") }}</span>
      </li>
    </ol>

    <template #footer>
      <router-link
        to="/ranking"
        class="flex-1 px-3 py-2 text-center text-sm font-medium text-brand-700 hover:bg-gray-50 dark:text-brand-300 dark:hover:bg-gray-800"
      >
        Ver el ranking completo →
      </router-link>
    </template>
  </PCard>
</template>
