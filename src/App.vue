<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>

@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
@import url('https://use.fontawesome.com/releases/v5.8.1/css/all.css');

</style>

<script>

  import {USER_REQUEST} from "./_store/actions/user";

  export default {
    created: function() {
      if (this.$store.getters.isAuthenticated) {
        this.$store.dispatch(USER_REQUEST); //Pedir los datos del usuario actual en cada componente
      }
    }
  }
</script>
