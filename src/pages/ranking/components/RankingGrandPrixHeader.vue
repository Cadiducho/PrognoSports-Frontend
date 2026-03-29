<template>
  <PTooltip :label="gp.name">
    {{ gp.code }}
  </PTooltip>
</template>

<script setup lang="ts">
import PTooltip from "@/components/lib/PTooltip.vue";
import { GrandPrix } from "@/types/GrandPrix";

defineProps<{
  gp: GrandPrix;
}>();
</script>

