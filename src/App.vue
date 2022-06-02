<template>
  <div id="app">
      <!-- La app siempre cargará router-view -->
      <!-- Las nested routes se encargarán de hacer aparecer unos u otros componentes, -->
      <!-- según si está iniciado sesión o la url solicitada -->

      <router-view :key="$route.fullPath"/>

      <ToTop scroll-y="200"/>
  </div>
</template>

<style>

@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
@import url('https://use.fontawesome.com/releases/v5.8.1/css/all.css');

</style>

<script lang="ts">
import {defineComponent} from "vue";
import ToTop from "@/components/lib/ToTop.vue";

export default defineComponent({
    components: {
        ToTop,
    }
});
</script>
