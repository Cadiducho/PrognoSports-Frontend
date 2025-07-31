<template>
  <component
    :is="to ? 'router-link' : href ? 'a' : 'button'"
    :to="to"
    :href="href"
    class="px-4 py-2 border-b-2 transition-all"
    :class="{
      'border-blue-500 text-blue-600 dark:text-blue-400 font-semibold':
        isActive,
      'border-transparent text-gray-00 dark:text-gray-300 hover:text-blue-500 hover:border-blue-300':
        !isActive,
    }"
    @click.prevent="handleClick"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed, inject, Ref } from "vue";

const props = defineProps<{
  name: string;
  to?: string;
  href?: string;
}>();

const activeTab = inject("activeTab") as Ref<string>;
const setActiveTab = inject("setActiveTab") as (tabName: string) => void;

const isActive = computed(() => activeTab?.value === props.name);

const handleClick = () => {
  if (!props.to && !props.href) {
    setActiveTab?.(props.name);
  }

  if (props.href) {
    window.open(props.href, "_blank");
  }
};
</script>
