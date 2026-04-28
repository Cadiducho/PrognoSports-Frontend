<template>
  <span :class="{ 'text-error-600 dark:text-error-400': isNegative }">
    {{ displayValue }}
  </span>
  <PTooltip
    v-if="isWinner()"
    :label="`Ganador de la sesión de ${session.humanName()}`"
  >
    <span class="text-brand-accent-600 dark:text-brand-accent-400"><i class="fas fa-trophy" /></span>
  </PTooltip>
</template>

<script setup lang="ts">
import { computed } from "vue";
import PTooltip from "@/components/lib/PTooltip.vue";
import type {Column} from "@/components/lib/table";
import type {RaceSession} from "@/types/RaceSession";

const props = defineProps<{
  row: any;
  column?: Column;
  value?: number;
  session: RaceSession;
  winnersBySession: Record<number, string[]>;
}>();

const displayValue = computed(() => props.value ?? 0);
const isNegative = computed(() => displayValue.value < 0);

function isWinner(): boolean {
  return (props.winnersBySession[props.session.id] || []).includes(props.row.user.username);
}
</script>


