<template>
  <div id="app">
      <!-- La app siempre cargará router-view -->
      <!-- Las nested routes se encargarán de hacer aparecer unos u otros componentes, -->
      <!-- según si está iniciado sesión o la url solicitada -->

      <router-view :key="$route.fullPath"/>

  </div>
</template>

<style>

@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
@import url('https://use.fontawesome.com/releases/v5.8.1/css/all.css');

</style>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import navbar from "@/components/navbar/Navbar.vue";
    import {namespace} from "vuex-class";
    import {User} from "@/types/User";
    import {Community} from "@/types/Community";
    const Auth = namespace("Auth");

    @Component({
        components: {
            navbar,
        }
    })
    export default class App extends Vue {

    }
</script>
