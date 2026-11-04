<template>
  <div class="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center dark:border-slate-700 dark:bg-slate-800">
    <p class="text-2xl font-bold text-slate-900 dark:text-slate-100">
      {{ value }}
    </p>
    <p class="text-xs text-slate-500 dark:text-slate-400">
      {{ label }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: "StatTile" });

defineProps<{
  label: string;
  value: string | number;
}>();
</script>
