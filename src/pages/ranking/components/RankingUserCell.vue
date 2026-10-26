<template>
  <PTooltip
    placement="right"
    variant="light"
  >
    <template #tooltip>
      <UserMiniCard :user="communityMembers.get(user.username)" />
    </template>

    <span class="font-bold">{{ user.username }}</span>
  </PTooltip>
</template>

<script setup lang="ts">
import UserMiniCard from "@/components/user/UserMiniCard.vue";
import PTooltip from "@/components/lib/PTooltip.vue";
import { User } from "@/types/User";

defineProps<{
  user: User;
  communityMembers: Map<string, User>;
}>();
</script>

