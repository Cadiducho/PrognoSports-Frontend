<template>
  <span v-if="row.score.standings < Number.MAX_SAFE_INTEGER">
    <template v-if="row.score.standings > 0">
      {{ row.score.standings }}º
      <template v-if="row.score.previousStandings > 0">
        <PTooltip
          v-if="row.score.previousStandings > row.score.standings"
          :label="`Asciende de ${row.score.previousStandings}º a ${row.score.standings}º`"
          variant="success"
        >
          <span class="text-success-500 dark:text-success-400"><i class="fas fa-arrow-up" /></span>
        </PTooltip>
        <PTooltip
          v-else-if="row.score.previousStandings < row.score.standings"
          :label="`Desciende de ${row.score.previousStandings}º a ${row.score.standings}º`"
          variant="danger"
        >
          <span class="text-error-500 dark:text-error-400"><i class="fas fa-arrow-down" /></span>
        </PTooltip>
      </template>
    </template>
    <template v-else>
      -
    </template>
  </span>
  <span v-else-if="row.score.previousStandings > 0">
    {{ row.score.previousStandings }}º
  </span>
  <template v-else>
    -
  </template>
</template>

<script setup lang="ts">
import PTooltip from "@/components/lib/PTooltip.vue";

defineProps<{
  row: any;
  value: number;
}>();
</script>

