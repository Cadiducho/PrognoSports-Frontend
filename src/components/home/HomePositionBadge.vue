<script setup lang="ts">
import { computed } from "vue";
import type { LatestPosition } from "@/composables/charts/homeSeason";

const props = defineProps<{
  position: LatestPosition | null;
}>();

// La flecha va acompañada de texto, para que el cambio no dependa solo del color
const change = computed(() => {
  const delta = props.position?.delta;
  if (delta === null || delta === undefined) {
    return null;
  }
  if (delta > 0) {
    return { symbol: "▲", text: `Has subido ${delta} ${delta === 1 ? "puesto" : "puestos"}`, tone: "text-green-600 dark:text-green-400" };
  }
  if (delta < 0) {
    return { symbol: "▼", text: `Has bajado ${-delta} ${delta === -1 ? "puesto" : "puestos"}`, tone: "text-red-600 dark:text-red-400" };
  }
  return { symbol: "=", text: "Te mantienes en el mismo puesto", tone: "text-gray-600 dark:text-gray-400" };
});
</script>

<template>
  <div>
    <p
      v-if="position"
      class="mb-2 flex flex-wrap items-baseline gap-x-3 text-sm text-gray-700 dark:text-gray-300"
    >
      <span>
        Vas
        <strong class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ position.standings }}º</strong>
        tras {{ position.gpCode }}
      </span>
      <span
        v-if="change"
        class="font-semibold"
        :class="change.tone"
      >
        <span aria-hidden="true">{{ change.symbol }}</span>
        {{ change.text }} respecto al GP anterior
      </span>
    </p>
  </div>
</template>
