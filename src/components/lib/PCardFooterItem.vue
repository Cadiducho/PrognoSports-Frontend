<template>
  <component
    :is="to ? 'router-link' : 'div'"
    :to="to"
    class="flex-1 p-3 text-center text-sm font-medium text-brand-700 hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-900/30"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import type {RouteLocationRaw} from "vue-router";

withDefaults(defineProps<{
  to?: RouteLocationRaw;
}>(), {
  to: undefined
});
</script>
