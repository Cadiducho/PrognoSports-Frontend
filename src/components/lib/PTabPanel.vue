<template>
  <div
    v-if="instant"
    v-show="isActiveTab()"
  >
    <slot />
  </div>
  <Transition
    v-else
    enter-active-class="transition-opacity transition-transform duration-250 ease-out motion-reduce:transition-none"
    enter-from-class="opacity-0 translate-x-2"
    enter-to-class="opacity-100 translate-x-0"
  >
    <div
      v-show="isActiveTab()"
      class="transform-gpu will-change-transform"
    >
      <slot />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { inject, Ref } from "vue";

const props = defineProps<{
  name: string;
  activeTab?: string;
  /** Cambio sin animación, para paneles muy altos donde el fundido hace parpadear la página */
  instant?: boolean;
}>();

const injectedActiveTab = inject<Ref<string> | null>("activeTab", null);

function isActiveTab(): boolean {
  const currentActiveTab = props.activeTab ?? injectedActiveTab?.value ?? "";
  return currentActiveTab === props.name;
}
</script>
