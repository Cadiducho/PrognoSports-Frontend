<template>
  <PrognoAlert
    variant="danger"
    aria-close-label="Close notification"
    role="alert"
  >
    No tienes permiso para visualizar esta página
  </PrognoAlert>
</template>

<script setup>
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
</script>
