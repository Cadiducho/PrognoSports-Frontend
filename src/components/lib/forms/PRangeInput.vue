<template>
  <div class="space-y-2">
    <div class="flex items-center gap-3">
      <input
        v-model.number="model"
        class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-brand-600 dark:bg-gray-700"
        type="range"
        :min="min"
        :max="max"
        :step="step"
      >
      <output class="min-w-8 rounded bg-brand-100 px-2 py-1 text-center text-sm font-semibold text-brand-800 dark:bg-brand-900/40 dark:text-brand-100">{{ model }}</output>
    </div>
    <div
      v-if="ticks"
      class="flex justify-between px-1 text-xs text-gray-500 dark:text-gray-400"
      aria-hidden="true"
    >
      <span
        v-for="tick in tickValues"
        :key="tick"
      >{{ tick }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const model = defineModel<number>({ required: true });
const props = withDefaults(defineProps<{
  min: number;
  max: number;
  step?: number;
  ticks?: boolean;
}>(), { step: 1, ticks: false });

const tickValues = computed(() => {
  const values: number[] = [];
  for (let value = props.min; value <= props.max; value += props.step) values.push(value);
  return values;
});
</script>
