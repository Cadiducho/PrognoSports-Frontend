<script setup lang="ts">
interface Props {
  tag?: 'article' | 'div' | 'router-link';
}
const props = withDefaults(defineProps<Props>(), {
  tag: 'article'
});
</script>

<template>
  <component
    :is="props.tag"
    class="bg-contrast dark:bg-contrast-dark shadow-md rounded-lg max-w-full dark:text-gray-300"
  >
    <div class="p-4">
      <slot name="header" />
      <slot />
      <slot name="footer" />
    </div>
  </component>
</template>
