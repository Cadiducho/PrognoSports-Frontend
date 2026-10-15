<template>
  <div class="relative ml-8 flex pb-8">
    <span :class="['absolute left-[-0.5px] top-0 block h-full w-px', lineClass]" />
    <span :class="['absolute left-0 top-5 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full text-xs', markerClass]">
      <i
        v-if="icon"
        :class="icon"
      />
    </span>
    <div class="min-w-0 flex-1 pl-8 pt-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";

const props = withDefaults(defineProps<{
  variant?: 'default' | 'primary' | 'warning' | 'danger';
  icon?: string;
}>(), {
  variant: 'default',
  icon: undefined
});

const lineClass = computed(() => ({
  default: 'bg-gray-300 dark:bg-gray-600',
  primary: 'bg-brand-accent-500',
  warning: 'bg-warning-500',
  danger: 'bg-error-500'
}[props.variant]));

const markerClass = computed(() => ({
  default: 'bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-100',
  primary: 'bg-brand-accent-500 text-white',
  warning: 'bg-warning-500 text-gray-900',
  danger: 'bg-error-500 text-white'
}[props.variant]));
</script>
