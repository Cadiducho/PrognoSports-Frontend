<template>
  <div>
    <div
      class="overflow-hidden rounded-lg border bg-white text-center text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100"
      :style="cardStyle"
    >
      <header
        class="px-2 py-1"
        :style="headerStyle"
      >
        <div class="flex items-center justify-center gap-2">
          <PTag
            size="small"
            class="!bg-gray-800 !border-gray-800 dark:!bg-gray-800 dark:!border-gray-800 text-gray-light-50"
          >
            {{ gridPos.position }}º
          </PTag>
          <PTag
            color="success"
            size="small"
          >
            #{{ gridPos.driver.number }}
          </PTag>
          <PTooltip
            v-if="gridPos.note !== undefined"
            :label="gridPos.note"
          >
            <PTag
              color="warning"
              size="small"
            >
              !
            </PTag>
          </PTooltip>
        </div>
      </header>

      <div class="flex flex-col items-center justify-center py-3">
        <div class="text-center text-xs">
          <PTooltip
            :label="fullname(gridPos.driver)"
            class="block text-[17px] font-semibold"
          >
            {{ gridPos.driver.code }}
          </PTooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import {StartGridPosition} from "@/types/StartGridPosition";
import {Driver} from "@/types/Driver";

import PTag from "@/components/lib/PTag.vue";
import PTooltip from "@/components/lib/PTooltip.vue";

defineOptions({ name: "StartGridCard" });

const { gridPos } = defineProps<{
  gridPos: StartGridPosition;
}>();

function fullname(driver: Driver): string {
  return driver.firstname + " " + driver.lastname;
}

function gridCardStyle(driver: Driver): Record<string, string> {
  return {
    border: "1px solid #" + driver.team.teamcolor,
  };
}

function gridCardBackgroundStyle(driver: Driver): Record<string, string> {
  return {
    backgroundColor: "#" + driver.team.teamcolor,
  };
}

const cardStyle = computed(() => gridCardStyle(gridPos.driver));
const headerStyle = computed(() => gridCardBackgroundStyle(gridPos.driver));

defineExpose({ gridPos, fullname, gridCardStyle, gridCardBackgroundStyle, cardStyle, headerStyle });
</script>

