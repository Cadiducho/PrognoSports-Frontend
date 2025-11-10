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
    class="bg-white dark:bg-gray-900 shadow-lg shadow-black/10 dark:shadow-white/5 ring-1 ring-black/5 dark:ring-white/6 rounded-lg max-w-full dark:text-gray-300 dark:border dark:border-gray-800"
  >
    <div class="p-4">
      <slot name="header" />
      <slot />
      <slot name="footer" />
    </div>
  </component>
</template>
