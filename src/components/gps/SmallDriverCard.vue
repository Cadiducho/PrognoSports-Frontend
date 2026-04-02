<template>
  <div
    class="driver-chip select-none cursor-move"
    :style="styleDriverCard(driver)"
  >
    <span v-if="position" class="driver-position">{{ position }}.</span>
    <span class="driver-code">{{ driver.code }}</span>
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

<style scoped lang="scss">
.driver-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-weight: 600;
  font-size: 0.875rem;
  opacity: 0.95;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: fit-content;

  &:hover {
    opacity: 1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }

  .driver-position {
    font-weight: 700;
    font-size: 0.8rem;
    opacity: 0.9;
  }

  .driver-code {
    font-weight: 700;
    letter-spacing: 0.5px;
  }
}
</style>


