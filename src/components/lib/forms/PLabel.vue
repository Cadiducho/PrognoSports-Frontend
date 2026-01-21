<template>
  <label
    class="block tracking-wide text-gray-700 dark:text-gray-300 font-bold mb-2"
    :for="props.name"
  >
    <slot>{{ props.label }}</slot>
    <span
      v-if="props.message"
      class="block text-xs font-normal text-gray-600 dark:text-gray-400 mt-1"
    >
      {{ props.message }}
    </span>
  </label>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  label?: string;
  name?: string;
  message?: string;
}>(), {
  label: '',
  name: '',
  message: ''
})
</script>
