<template>
  <span class="font-semibold">{{ value }}</span>
</template>

<script setup lang="ts">
defineProps<{
  value: number | string;
}>();
</script>

