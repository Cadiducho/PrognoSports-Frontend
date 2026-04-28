<template>
  <span class="font-semibold">{{ value }}</span>
</template>

<script setup lang="ts">
import type {Column} from "@/components/lib/table";

defineProps<{
  row: any;
  column?: Column;
  value: number | string;
}>();
</script>

