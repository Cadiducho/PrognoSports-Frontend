<template>
  <div class="flex items-start gap-4">
    <div
      v-if="$slots.left"
      class="shrink-0"
    >
      <slot name="left" />
    </div>
    <div class="min-w-0 flex-1">
      <slot />
    </div>
  </div>
</template>
