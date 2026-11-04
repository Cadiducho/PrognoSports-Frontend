<template>
  <div
    class="my-3 first:mt-0"
    :class="fieldSpanClass(span)"
  >
    <PLabel
      v-if="label"
      :name="name"
      :label="label"
    />

    <slot />

    <p
      v-if="message"
      class="mt-1 text-xs text-gray-500 dark:text-gray-400"
    >
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import PLabel from "@/components/lib/forms/PLabel.vue";
import {FieldSpan, fieldSpanClass} from "@/components/lib/forms/formGrid";

withDefaults(defineProps<{
  label?: string;
  name?: string;
  /** Texto de ayuda, se muestra debajo del control */
  message?: string;
  /** Columnas que ocupa dentro de un `PFormGrid` */
  span?: FieldSpan;
}>(), {
  label: '',
  name: '',
  message: '',
  span: undefined,
});
</script>
