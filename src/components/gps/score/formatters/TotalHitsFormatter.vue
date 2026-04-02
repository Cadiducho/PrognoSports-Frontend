<template>
  <PTooltip>
    <span :class="{ 'font-semibold': topScorerUsers.includes(row.user.id) }">
      {{ value }}
      <sub
        v-if="pointsByTopScorer > 0 && topScorerUsers.includes(row.user.id)"
        class="text-success-600 dark:text-success-400 font-semibold"
      >
        +{{ pointsByTopScorer }}
      </sub>
    </span>

    <template #tooltip>
      <ul v-if="sessions.length > 1">
        <li><b>{{ value }} aciertos en el Gran Premio</b></li>
        <li
          v-for="ses in sessions"
          :key="ses.id"
        >
          <b>{{ sessionHumanName(ses.id) }}</b>: {{ hitsBySession[row.user.id]?.[ses.id] ?? 0 }} aciertos
        </li>
      </ul>
    </template>
  </PTooltip>
</template>

<script setup lang="ts">
import PTooltip from "@/components/lib/PTooltip.vue";

defineProps<{
  row: any;
  value: number;
  topScorerUsers: number[];
  pointsByTopScorer: number;
  sessions: any[];
  hitsBySession: Record<number, Record<number, number>>;
  sessionHumanName: (id: number) => string;
}>();
</script>

