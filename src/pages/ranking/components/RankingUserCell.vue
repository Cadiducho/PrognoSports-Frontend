<template>
  <o-tooltip
    position="right"
    variant="light"
  >
    <template #content>
      <UserMiniCard :user="communityMembers.get(entry.user.username)" />
    </template>

    <span class="font-bold">{{ entry.user.username }}</span>
  </o-tooltip>
</template>

<script setup lang="ts">
import UserMiniCard from "@/components/user/UserMiniCard.vue";
import { TableEntry } from "@/pages/ranking/types/ranking";
import { User } from "@/types/User";

defineProps<{
  entry: TableEntry;
  communityMembers: Map<string, User>;
}>();
</script>


