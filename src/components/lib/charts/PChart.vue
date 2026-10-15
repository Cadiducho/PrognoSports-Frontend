<script setup lang="ts">
import type { ChartDefinition } from "@tanstack/charts";
import { Chart } from "@tanstack/charts/vue";

interface Props {
  definition: ChartDefinition;
  ariaLabel: string;
  ariaDescription?: string;
  /** Altura fija en px. Si se omite, se usa la altura por defecto de la librería */
  height?: number;
}

withDefaults(defineProps<Props>(), {
  ariaDescription: undefined,
  height: 400,
});
</script>

<template>
  <div class="p-chart w-full max-w-full text-gray-800 dark:text-gray-200">
    <Chart
      :definition="definition"
      :aria-label="ariaLabel"
      :aria-description="ariaDescription"
      :height="height"
    />
  </div>
</template>
