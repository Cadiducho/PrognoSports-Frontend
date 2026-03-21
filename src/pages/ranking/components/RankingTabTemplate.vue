<template>
  <o-tab-item
    :label="label"
    :value="value"
  >
    <PTitle
      type="subtitle"
      class="mb-3"
    >
      {{ title }}
    </PTitle>

    <slot name="intro" />
    <slot name="table" />
    <slot name="before-chart-title" />

    <h1 class="mt-4 mb-3 text-2xl font-semibold">
      {{ chartTitle }}
    </h1>

    <slot name="chart" />
  </o-tab-item>
</template>

<script setup lang="ts">
import PTitle from "@/components/lib/PTitle.vue";

defineProps<{
  label: string;
  value: number;
  title: string;
  chartTitle: string;
}>();
</script>

