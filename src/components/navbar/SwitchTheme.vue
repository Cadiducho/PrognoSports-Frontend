<template>
  <div class="flex items-center select-none">
    <input
      id="switch"
      v-model="darkMode"
      type="checkbox"
      class="switch"
      :checked="darkMode"
      @change="switchTheme"
    >
    <label
      for="switch"
      class="label bg-gray-600 dark:bg-gray-200 cursor-pointer"
    >
      <span class="">🌑</span>
      <span class="">☀️</span>
      <div class="ball dark:bg-gray-600 bg-gray-200" />
    </label>
  </div>
</template>

<script setup lang="ts">
// Autor: @Eschiclers https://github.com/Eschiclers/eschiclers.github.io
import {useThemeStore} from "@/store/themeStore";

const styleStore = useThemeStore();
const darkMode = styleStore.darkMode;
const switchTheme = styleStore.toggleDarkMode;
</script>

<style lang="css" scoped>
.switch {
    position: absolute;
    opacity: 0;
}

.switch:checked + .label .ball {
    transform: translateX(24px);
}

.switch + .ball {
    top: 0;
    left: 0;
}

.label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 50px;
    position: relative;
    padding: 2px;
    height: 26px;
    width: 50px;
}

.ball {
    border-radius: 50%;
    height: 22px;
    width: 22px;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: transform 0.2s linear;
}
</style>