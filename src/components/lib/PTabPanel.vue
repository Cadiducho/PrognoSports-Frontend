<template>
  <div v-show="isActive">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject, computed, Ref } from "vue";

const props = defineProps<{
  name: string;
}>();

const activeTab = inject("activeTab") as Ref<string>;

const isActive = computed(() => activeTab?.value === props.name);
</script>
