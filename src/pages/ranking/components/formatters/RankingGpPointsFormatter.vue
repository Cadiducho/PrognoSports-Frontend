<template>
  <template v-if="userPoints">
    <PointsTooltipComponent
      :gp-name="gp.name"
      :user-points="userPoints"
      :display-points="userPoints.pointsInGP"
    />

    <PTooltip
      v-if="userPoints.pointsInGP && checkGpWinner(gp.id, userPoints.pointsInGP)"
      :label="`Ganador de ${gp.name}`"
    >
      <span class="text-blue-500">
        <PIcon icon="fas fa-trophy" />
      </span>
    </PTooltip>
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
import PIcon from "@/components/lib/PIcon.vue";
import PTooltip from "@/components/lib/PTooltip.vue";
import PointsTooltipComponent from "@/pages/ranking/components/PointsTooltipComponent.vue";

const props = defineProps<{
  row: { entry: TableEntry; gpsById: Record<number, UserPoints | undefined> };
  column?: Column;
  value?: unknown;
  gp: GrandPrix;
  checkGpWinner: (gpId: number, score: number) => boolean;
}>();

const userPoints = computed(() => {
  // NOTE: userPoints may be undefined if the user has not participated in this GP.
  return props.row?.gpsById?.[props.gp.id];
});
</script>


