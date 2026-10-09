<template>
  <PTooltip
    placement="right"
    variant="light"
  >
    <template #tooltip>
      <UserMiniCard :user="communityMembers.get(entry.user.username)" />
    </template>

    <span class="font-bold">{{ entry.user.username }}</span>
  </PTooltip>
</template>

<script setup lang="ts">
import UserMiniCard from "@/components/user/UserMiniCard.vue";
import PTooltip from "@/components/lib/PTooltip.vue";
import { TableEntry } from "@/pages/ranking/types/ranking";
import { User } from "@/types/User";

defineProps<{
  entry: TableEntry;
  communityMembers: Map<string, User>;
}>();
</script>


