<template>
  <span class="font-bold">#{{ value }}</span>
</template>

<script setup lang="ts">
import type { Column } from "@/components/lib/table";

defineProps<{
  row: any;
  column?: Column;
  value: number;
}>();
</script>

