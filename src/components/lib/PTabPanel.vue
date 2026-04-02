<template>
  <div v-show="isActiveTab()">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject, Ref } from "vue";

const props = defineProps<{
  name: string;
}>();

const activeTab = inject("activeTab") as Ref<string>;

function isActiveTab(): boolean {
  return activeTab?.value === props.name;
}
</script>
