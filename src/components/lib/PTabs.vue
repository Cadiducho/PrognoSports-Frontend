<template>
  <div class="w-full">
    <div class="flex flex-wrap border-b border-gray-200 dark:border-gray-700 gap-1">
      <slot name="tabs" />
    </div>
    <div class="pt-3">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import {provide, watch} from "vue";

const model = defineModel<string>({required: true});

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
