<template>
  <PronoAlert
    variant="danger"
    aria-close-label="Close notification"
    role="alert"
  >
    No tienes permiso para visualizar esta página
  </PronoAlert>
</template>

<script setup>
import PronoAlert from "@/components/lib/PronoAlert.vue";
</script>
