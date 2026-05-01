<template>
  <div class="w-full">
    <div
      class="flex flex-wrap border-b border-gray-200 dark:border-gray-700 gap-1"
      :class="{ 'bg-gray-100 dark:bg-gray-800 rounded-t-lg p-1': variant === 'boxed' }"
    >
      <slot name="tabs" />
    </div>
    <div
      class="pt-3 overflow-hidden"
      :class="{ 'rounded-b-lg border border-gray-200 dark:border-gray-700 p-3': variant === 'boxed' }"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide, watch } from "vue";

const props = defineProps<{
  variant?: 'default' | 'boxed';
}>();

const model = defineModel<string>({ required: true });

const setActiveTab = (tabName: string): void => {
  model.value = tabName;
};

provide("activeTab", model);
provide("setActiveTab", setActiveTab);

watch(model, (value) => {
  if (!value) {
    model.value = "";
  }
});
</script>
