<template>
  <div id="logoutComponent" />
</template>

<script setup lang="ts">

import { onMounted } from "vue";
import { useAuth } from "@/composables/useAuth";
const auth = useAuth();

onMounted(async() => {
    await auth.logout();
});
</script>