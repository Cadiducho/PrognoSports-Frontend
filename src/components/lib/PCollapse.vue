<template>
  <transition name="collapse">
    <div
      v-show="isOpen"
      class="overflow-hidden"
    >
      <div class="p-1 pb-3">
        <slot />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
const isOpen = defineModel<boolean>("open", { default: true });
</script>

<style scoped>
.collapse-enter-active, .collapse-leave-active {
  transition: opacity 0.2s ease;
}
.collapse-enter, .collapse-leave-to {
  opacity: 0;
}
</style>
