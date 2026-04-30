<template>
  <template v-if="value?.driver">
    <PTooltip
      :label="driverTooltip(value.driver)"
      placement="top"
    >
      <span
        class="text-slate-900 dark:text-white"
        :style="styleCodeInResults(value.driver)"
      >
        {{ value.driver.code }}
        <sub
          v-if="getSessionPoints() !== undefined"
          :class="{
            'text-brand-600 dark:text-blue-500': (getSessionPoints() || 0) > 0,
            'text-error-600 dark:text-error-400': (getSessionPoints() || 0) < 0,
          }"
        >
          {{ getSessionPoints() }}
        </sub>
      </span>
    </PTooltip>
  </template>
  <template v-else>
    ---
  </template>
</template>

<script setup lang="ts">
import PTooltip from "@/components/lib/PTooltip.vue";
import {Column} from "@/components/lib/table";

const props = defineProps<{
  row: any;
  column: Column;
  value?: any;
  position: number;
  pointsByPosition: Record<number, Record<number, number>>;
  styleCodeInResults: (driver: any) => string;
  driverTooltip: (driver: any) => string;
}>();

function getSessionPoints(): number | undefined {
  return props.pointsByPosition[props.row.user.id]?.[props.position];
}
</script>


