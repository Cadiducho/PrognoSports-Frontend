
<template>
  <PIcon
    :icon="icon"
    :class="[color, 'cursor-pointer', 'hover:scale-125', 'transition', 'duration-150', 'ease-in-out']"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import PIcon from "@/components/lib/PIcon.vue";
import {computed} from "vue";

const props = defineProps({
  value: Boolean,
})

const icon = computed(() => {
  if (props.value) {
    return 'fas fa-check';
  } else {
    return 'fas fa-times';
  }
})

const color = computed(() => {
  if (props.value) {
    return ['text-success-500', 'hover:text-success-700'];
  } else {
    return ['text-error-500', 'hover:text-error-700'];
  }
})

</script>

