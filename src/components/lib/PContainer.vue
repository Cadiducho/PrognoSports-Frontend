<template>
  <component
    :is="tag"
    :class="['mx-auto w-full', flush ? '' : 'px-2 sm:px-4 lg:px-6', sizeClass]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import {computed} from "vue";

const props = withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  tag?: string;
  /** Sin gutter lateral: el contenido llega al borde en pantallas pequeñas */
  flush?: boolean;
}>(), {
  size: 'xl',
  tag: 'div',
  flush: false
});

const sizeClass = computed(() => ({
  sm: 'max-w-md',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-none'
}[props.size]));
</script>
