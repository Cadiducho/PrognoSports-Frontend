<template>
  <div class="my-3 first:mt-0">
    <PLabel
      :name="name"
      :label="label"
      :message="message"
    />

    <slot />
  </div>
</template>

<script setup lang="ts">
import PLabel from "@/components/lib/forms/PLabel.vue";

const props = withDefaults(defineProps<{
  label?: string;
  name?: string;
  message?: string;
}>(), {
  label: '',
  name: '',
  message: ''
});
</script>
