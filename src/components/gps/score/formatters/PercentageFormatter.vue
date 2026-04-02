<template>
  <span v-if="(value ?? -1) >= 0">
    {{ Number(((value ?? 0) * 100).toFixed(2)) }}%
  </span>
  <span v-else>
    -
  </span>
</template>

<script setup lang="ts">
defineProps<{
  value: number;
}>();
</script>

