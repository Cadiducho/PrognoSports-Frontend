<template>
  <template v-if="userPoints">
    <PTag
      v-if="checkAccumulatedWinner(gp.id, userPoints.accumulatedPoints)"
      color="warning"
      size="small"
    >
      <PointsTooltipComponent
        :gp-name="gp.name"
        :user-points="userPoints"
        :display-points="userPoints.accumulatedPoints"
      />
    </PTag>

    <template v-else>
      <PointsTooltipComponent
        :gp-name="gp.name"
        :user-points="userPoints"
        :display-points="userPoints.accumulatedPoints"
      />
    </template>
  </template>

  <template v-else>
    0 :(
  </template>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Column } from "@/components/lib/table";
import type { TableEntry } from "@/pages/ranking/types/ranking";
import type { GrandPrix } from "@/types/GrandPrix";
import type { UserPoints } from "@/types/UserPoints";
import PTag from "@/components/lib/PTag.vue";
import PointsTooltipComponent from "@/pages/ranking/components/PointsTooltipComponent.vue";

const props = defineProps<{
  row: { entry: TableEntry; gpsById: Record<number, UserPoints | undefined> };
  column?: Column;
  value?: unknown;
  gp: GrandPrix;
  checkAccumulatedWinner: (gpId: number, score: number) => boolean;
}>();

const userPoints = computed(() => props.row?.gpsById?.[props.gp.id]);
</script>

