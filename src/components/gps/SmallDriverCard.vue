<template>
  <div
    class="inline-flex min-w-fit select-none cursor-move items-center justify-center gap-1 whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold opacity-95 shadow-sm transition-all duration-200 ease-in-out hover:opacity-100 hover:shadow"
    :style="styleDriverCard(driver)"
  >
    <span v-if="position" class="text-xs font-bold opacity-90 dark:text-white">{{ position }}.</span>
    <span class="font-bold tracking-wide dark:text-white">{{ driver.code }}</span>
  </div>
</template>

<script setup lang="ts">
import { Driver } from "@/types/Driver";
import { useStyles } from "@/composables/useStyles";

defineProps<{
  driver: Driver;
  position?: number;
}>();

const styles = useStyles();
const styleDriverCard = styles.styleDriverCard;
</script>



