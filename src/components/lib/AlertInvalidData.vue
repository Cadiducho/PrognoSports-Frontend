<template>
  <PrognoAlert
    v-if="props.object == undefined || props.object.toString().trim() === ''"
    variant="danger"
    aria-close-label="Close notification"
    role="alert"
  >
    {{ props.message }}
  </PrognoAlert>
</template>

<script setup lang="ts">
import PrognoAlert from "@/components/lib/PrognoAlert.vue";

const props = withDefaults(defineProps<{
  object?: object;
  message: string;
}>(), {
  object: undefined,
});
</script>
