<template>
  <span class="font-bold">#{{ index + 1 }}</span>
</template>

<script setup lang="ts">
defineProps<{
  index: number;
}>();
</script>


