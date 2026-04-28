<template>
  <span>
    {{ value }}
    <PTooltip
      v-if="winnersOfGrandPrix.includes(row.user.username)"
      label="Ganador del Gran Premio"
    >
      <span class="text-brand-accent-600 dark:text-brand-accent-400"><i class="fas fa-trophy" /></span>
    </PTooltip>
  </span>
</template>

<script setup lang="ts">
import PTooltip from "@/components/lib/PTooltip.vue";
import type {Column} from "@/components/lib/table";

defineProps<{
  row: any;
  column?: Column;
  value: number;
  winnersOfGrandPrix: string[];
}>();
</script>


