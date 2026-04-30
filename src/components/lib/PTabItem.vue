<template>
  <component
    :is="tabTag"
    :to="to"
    :href="href"
    :type="!to && !href ? 'button' : undefined"
    class="px-4 py-2 border-b-2 transform-gpu transition-[color,border-color,transform] duration-200 ease-out motion-reduce:transition-none"
    :class="tabClasses"
    @click.prevent="handleClick"
  >
    {{ label }}
  </component>
</template>

<script setup lang="ts">
import { computed, inject, Ref } from "vue";

const props = defineProps<{
  name: string;
  label?: string;
  to?: string;
  href?: string;
  activeTab?: string;
  setActiveTab?: (tabName: string) => void;
}>();

const injectedActiveTab = inject<Ref<string> | null>("activeTab", null);
const injectedSetActiveTab = inject<((tabName: string) => void) | null>("setActiveTab", null);

const tabTag = computed(() => (props.to ? 'router-link' : props.href ? 'a' : 'button'));
const currentActiveTab = computed(() => props.activeTab ?? injectedActiveTab?.value ?? "");
const isActive = computed(() => currentActiveTab.value === props.name);
const tabClasses = computed(() => [
  isActive.value
    ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-semibold translate-x-1'
    : 'border-transparent text-gray-700 dark:text-gray-300 hover:text-blue-500 hover:border-blue-300 motion-safe:hover:translate-x-1',
]);

const handleClick = () => {
  if (!props.to && !props.href) {
    const applyActiveTab = props.setActiveTab ?? injectedSetActiveTab;
    applyActiveTab?.(props.name);
  }

  if (props.href) {
    window.open(props.href, "_blank");
  }
};
</script>
