<template>
  <label
    class="block tracking-wide text-gray-700 dark:text-gray-300 font-bold mb-2"
    :for="props.name"
  >
    {{ props.label }}
  </label>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  label?: string;
  name?: string;
}>(), {
  label: '',
  name: ''
})
</script>

<style scoped lang="scss">

</style>
