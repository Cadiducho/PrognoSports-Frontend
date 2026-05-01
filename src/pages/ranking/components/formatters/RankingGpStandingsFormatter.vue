<template>
  <template v-if="userPoints">
    <PTag
      v-if="userPoints.standings === 1"
      color="warning"
      size="small"
    >
      {{ userPoints.standings }}
    </PTag>

    <template v-else>
      <template v-if="userPoints.standings >= 1">
        {{ userPoints.standings }}
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

const props = defineProps<{
  row: { entry: TableEntry; gpsById: Record<number, UserPoints | undefined> };
  column?: Column;
  value?: unknown;
  gp: GrandPrix;
}>();

const userPoints = computed(() => props.row?.gpsById?.[props.gp.id]);
</script>


