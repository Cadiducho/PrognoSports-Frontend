<template>
  <div id="app">
      <Toaster richColors :position="toastStore.getPosition"  />

      <!-- La app siempre cargará router-view -->
      <!-- Las nested routes se encargarán de hacer aparecer unos u otros componentes, -->
      <!-- según si está iniciado sesión o la url solicitada -->

      <router-view :key="$route.fullPath"/>

      <ToTop :scroll-y="200"/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import ToTop from "@/components/lib/ToTop.vue";
import { Toaster } from 'vue-sonner'
import {useToastStore} from "@/store/toastStore";

export default defineComponent({
    components: {
        ToTop, Toaster
    },
    setup() {
        const toastStore = useToastStore();
        return {toastStore};
    }
});
</script>