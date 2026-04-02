<template>
  <span :class="{ 'text-error-600 dark:text-error-400': (value ?? 0) < 0 }">
    {{ value ?? 0 }}
  </span>
  <PTooltip
    v-if="isWinner()"
    :label="`Ganador de la sesión de ${session.humanName()}`"
  >
    <span class="text-brand-accent-600 dark:text-brand-accent-400"><i class="fas fa-trophy" /></span>
  </PTooltip>
</template>

<script setup lang="ts">
import PTooltip from "@/components/lib/PTooltip.vue";

const props = defineProps<{
  row: any;
  value: number;
  session: any;
  winnersBySession: Record<number, string[]>;
}>();

function isWinner(): boolean {
  return (props.winnersBySession[props.session.id] || []).includes(props.row.user.username);
}
</script>


