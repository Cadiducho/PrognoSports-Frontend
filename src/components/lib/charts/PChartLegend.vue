<script setup lang="ts">
import type { ChartLegendItem } from "@/components/lib/charts/types";

const visibleKeys = defineModel<string[]>({ required: true });

const props = defineProps<{
  items: ChartLegendItem[];
  ariaLabel: string;
}>();

const isVisible = (key: string): boolean => visibleKeys.value.includes(key);

const toggle = (key: string): void => {
  // Se conserva el orden de la leyenda para que el estado compartido sea determinista
  const next = new Set(visibleKeys.value);
  if (!next.delete(key)) {
    next.add(key);
  }
  visibleKeys.value = props.items.map((item) => item.key).filter((itemKey) => next.has(itemKey));
};

const activeStyle = (item: ChartLegendItem) => ({
  backgroundColor: `color-mix(in srgb, ${item.color} 18%, transparent)`,
  borderColor: `color-mix(in srgb, ${item.color} 65%, transparent)`,
});
</script>

<template>
  <ul
    class="mt-3 flex flex-wrap gap-2"
    role="group"
    :aria-label="ariaLabel"
  >
    <li
      v-for="item in items"
      :key="item.key"
      class="min-w-0 max-w-full"
    >
      <button
        type="button"
        class="inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        :class="isVisible(item.key)
          ? 'text-gray-900 hover:brightness-95 dark:text-gray-100 dark:hover:brightness-125'
          : 'border-gray-500/30 bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 dark:text-gray-400'"
        :style="isVisible(item.key) ? activeStyle(item) : undefined"
        :aria-pressed="isVisible(item.key)"
        :aria-label="item.label"
        :title="item.label"
        @click="toggle(item.key)"
      >
        <span
          class="h-2.5 w-2.5 shrink-0 rounded-[3px] border-2"
          :style="{
            borderColor: item.color,
            backgroundColor: isVisible(item.key) ? item.color : 'transparent',
          }"
        />
        <span class="max-w-[11rem] truncate">{{ item.label }}</span>
      </button>
    </li>
  </ul>
</template>
