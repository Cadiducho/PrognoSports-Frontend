<template>
  <label
    for="switch"
    class="inline-flex cursor-pointer select-none items-center"
  >
    <input
      id="switch"
      type="checkbox"
      :checked="darkMode"
      class="peer sr-only"
      @change="switchTheme"
    >
    <span class="switch-container relative flex h-7 w-14 items-center justify-between rounded-full bg-gray-600 px-1.5 text-xs text-white dark:bg-gray-200 dark:text-gray-800">
      <span class="switch-icon">🌑</span>
      <span class="switch-icon">☀️</span>
      <span class="switch-ball absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-gray-200 shadow dark:bg-gray-700" />
    </span>
  </label>
</template>

<script setup lang="ts">
// Autor: @Eschiclers https://github.com/Eschiclers/eschiclers.github.io
import {useThemeStore} from "@/store/themeStore";

const styleStore = useThemeStore();
const darkMode = styleStore.darkMode;
const switchTheme = styleStore.toggleDarkMode;
</script>

<style scoped>
.switch-container {
  transition: background-color 0.3s ease;
}

#switch:checked ~ .switch-container {
  @apply bg-yellow-300 dark:bg-indigo-700;
}

.switch-ball {
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

#switch:checked ~ .switch-container .switch-ball {
  transform: translateX(1.75rem);
}
</style>

