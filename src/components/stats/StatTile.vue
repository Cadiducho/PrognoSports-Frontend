<script setup lang="ts">
defineOptions({ name: "StatTile" });

/** Dato destacado con su etiqueta. Es un `<li>`: va siempre dentro de un `<ul>` */
defineProps<{
  label: string;
  value: string | number;
  /** Aclaración bajo el valor: el GP en que ocurrió, la mejor racha… */
  hint?: string;
}>();
</script>

<template>
  <li class="flex min-w-0 flex-col rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-800">
    <span class="text-xs uppercase tracking-tight text-gray-600 dark:text-gray-400">{{ label }}</span>
    <strong class="text-lg text-gray-900 dark:text-gray-100">{{ value }}</strong>
    <span
      v-if="hint"
      class="text-xs text-gray-600 dark:text-gray-400"
    >{{ hint }}</span>
  </li>
</template>
