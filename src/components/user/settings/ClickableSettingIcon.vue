
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
    return ['text-success-600', 'hover:text-success-700', 'dark:text-success-400', 'dark:hover:text-success-300'];
  } else {
    return ['text-error-600', 'hover:text-error-700', 'dark:text-error-400', 'dark:hover:text-error-300'];
  }
})

</script>

