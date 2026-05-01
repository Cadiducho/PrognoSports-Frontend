<template>
  <template v-if="userPoints">
    <PTag
      v-if="userPoints.hitsInGP >= 0 && checkMaxHits(gp.id, userPoints.hitsInGP)"
      color="warning"
      size="small"
    >
      <HitsTooltipComponent
        :gp-name="gp.name"
        :user-points="userPoints"
      />
    </PTag>

    <template v-else>
      <template v-if="userPoints.hitsInGP >= 0">
        <HitsTooltipComponent
          :gp-name="gp.name"
          :user-points="userPoints"
        />
      </template>
      <template v-else>
        --
      </template>
    </template>
  </template>

  <template v-else>
    :(
  </template>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Column } from "@/components/lib/table";
import type { TableEntry } from "@/pages/ranking/types/ranking";
import type { GrandPrix } from "@/types/GrandPrix";
import type { UserPoints } from "@/types/UserPoints";
import PTag from "@/components/lib/PTag.vue";
import HitsTooltipComponent from "@/pages/ranking/components/HitsTooltipComponent.vue";

const props = defineProps<{
  row: { entry: TableEntry; gpsById: Record<number, UserPoints | undefined> };
  column?: Column;
  value?: unknown;
  gp: GrandPrix;
  checkMaxHits: (gpId: number, hits: number) => boolean;
}>();

const userPoints = computed(() => props.row?.gpsById?.[props.gp.id]);
</script>

