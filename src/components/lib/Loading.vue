<template>
  <div
    id="loadingComponent"
    class="flex w-full items-center justify-center py-6"
    role="status"
    aria-live="polite"
    aria-label="Cargando contenido"
  >
    <div class="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-cyan-500 dark:border-slate-600 dark:border-t-cyan-400" />
    <span class="sr-only">Cargando...</span>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: "Loading" });
</script>
