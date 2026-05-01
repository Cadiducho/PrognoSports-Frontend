<template>
  <RankingUserCell
    :entry="row.entry"
    :community-members="communityMembers"
  />
</template>

<script setup lang="ts">
import type { Column } from "@/components/lib/table";
import type { TableEntry } from "@/pages/ranking/types/ranking";
import type { User } from "@/types/User";
import RankingUserCell from "@/pages/ranking/components/RankingUserCell.vue";

defineProps<{
  row: { entry: TableEntry };
  column?: Column;
  value?: unknown;
  communityMembers: Map<string, User>;
}>();
</script>

