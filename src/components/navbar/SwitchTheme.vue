<template>
  <label
    :for="switchId"
    class="inline-flex cursor-pointer select-none items-center"
    :title="darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
  >
    <input
      :id="switchId"
      type="checkbox"
      role="switch"
      :checked="darkMode"
      aria-label="Modo oscuro"
      class="peer sr-only"
      @change="switchTheme"
    >
    <span
      class="switch-container relative flex h-7 w-14 items-center justify-between rounded-full bg-gray-600 px-1.5 text-xs text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white dark:bg-gray-200 dark:text-gray-800 dark:peer-focus-visible:ring-brand-300 dark:peer-focus-visible:ring-offset-gray-900"
      aria-hidden="true"
    >
      <span class="switch-icon">🌑</span>
      <span class="switch-icon">☀️</span>
      <span class="switch-ball absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-gray-200 shadow-sm dark:bg-gray-700" />
    </span>
  </label>
</template>

<script setup lang="ts">
// Autor: @Eschiclers https://github.com/Eschiclers/eschiclers.github.io
import {useId} from "vue";
import {storeToRefs} from "pinia";
import {useThemeStore} from "@/store/themeStore";

const styleStore = useThemeStore();
const { darkMode } = storeToRefs(styleStore);
const switchTheme = styleStore.toggleDarkMode;
const switchId = useId();
</script>

<style scoped>
@reference "@/styles/app.css";

.switch-container {
  transition: background-color 0.3s ease;
}

input:checked ~ .switch-container {
  @apply bg-yellow-300 dark:bg-indigo-700;
}


.switch-ball {
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

input:checked ~ .switch-container .switch-ball {
  transform: translateX(1.75rem);
}
@media (prefers-reduced-motion: reduce) {
  .switch-container,
  .switch-ball {
    transition: none;
  }
}
</style>

