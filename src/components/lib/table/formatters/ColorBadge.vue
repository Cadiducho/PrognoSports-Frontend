<template>
  <div class="flex items-center gap-2">
    <div
      class="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 shadow-sm"
      :style="{ backgroundColor: colorValue }"
      :title="colorValue"
    />
    <span class="text-sm font-mono">{{ colorValue }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  value: string;
  row?: any;
  column?: any;
}>();

const colorValue = computed(() => {
  if (!props.value) return '#000000';
  // Si el valor ya tiene #, lo devuelve tal cual
  if (props.value.startsWith('#')) return props.value;
  // Si no tiene #, lo agrega
  return `#${props.value}`;
});
</script>

