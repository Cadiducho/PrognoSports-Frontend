<template>
  <transition name="collapse">
    <div
      v-show="isOpen"
      class="mt-2 overflow-hidden"
    >
      <slot />
    </div>
  </transition>
</template>

<script setup lang="ts">
const isOpen = defineModel<boolean>("open", { default: true });
</script>

<style scoped lang="scss">
.collapse-enter-active, .collapse-leave-active {
  transition: opacity 0.2s ease;
}
.collapse-enter, .collapse-leave-to {
  opacity: 0;
}
</style>
