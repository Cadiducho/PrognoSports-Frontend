<template>
  <PTooltip placement="right">
    <span class="font-semibold">{{ row.user.username }}</span>
    <template #tooltip>
      <UserMiniCard :user="row.user" />
    </template>
  </PTooltip>
</template>

<script setup lang="ts">
import PTooltip from "@/components/lib/PTooltip.vue";
import UserMiniCard from "@/components/user/UserMiniCard.vue";

defineProps<{
  row: any;
  value: string;
}>();
</script>

