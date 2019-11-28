<template>
  <div id="app">
    <div v-if="this.$store.getters.isAuthenticated">
      <!-- App cargada e iniciada sesión -->
      <div class="adminx-container">

        <navbar />

        <div class="adminx-content">
          <div class="adminx-main-content">
            <router-view/>
          </div>
          <a id="back-to-top" href="#" class="btn btn-primary btn-lg back-to-top" role="button" title="Volver arriba" data-toggle="tooltip" data-placement="left"><i class="material-icons">keyboard_arrow_up</i></a>
        </div>
      </div>
    </div>

    <div v-else>
      <!-- Resto de paginas -->
      <router-view/>
    </div>
  </div>
</template>

<style>

@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
@import url('https://use.fontawesome.com/releases/v5.8.1/css/all.css');

.back-to-top {
  cursor: pointer;
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: none;
}
</style>

<script>

  import {USER_REQUEST} from "@/_store/actions/user";
  import {COMMUNITY_REQUEST} from "@/_store/actions/community";
  import navbar from "@/components/navbar/Navbar";

  export default {
    components: {
      navbar,
    },
    data() {
      return {
        isAuthenticated: false
      }
    },
    created: function() {
      if (this.$store.getters.isAuthenticated) {
        this.$store.dispatch(USER_REQUEST); //Pedir los datos del usuario actual en cada componente
        this.$store.dispatch(COMMUNITY_REQUEST);
      }
    }
  }
</script>
