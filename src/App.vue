<template>
  <div id="app">
    <div v-if="this.isLoggedIn">
      <!-- App cargada e iniciada sesión -->
      <div class="prognosports-container">

        <navbar />
        <sidebar :active-page="this.$route.name" :competition="currentCommunity.competition" />

        <div class="prognosports-content">
          <div class="prognosports-main-content">
            <b-alert show dismissible fade variant="warning">Estás utilizando PrognoSports Beta, la experiencia puede verse afectada</b-alert>

            <router-view/>
          </div>
          <a id="back-to-top" @click="backToTop()" class="btn btn-primary btn-lg back-to-top" role="button" title="Volver arriba" data-toggle="tooltip" data-placement="left"><i class="material-icons">keyboard_arrow_up</i></a>
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

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";

  import navbar from "@/components/navbar/Navbar.vue";
  import sidebar from "@/components/sidebar/Sidebar.vue";
  import {UserModule} from "@/_store/modules/UserModule";
  import {AuthModule} from "@/_store/modules/AuthModule";

  @Component({
    components: {
      navbar,
      sidebar
    }
  })
  export default class App extends Vue {

    get isLoggedIn(): boolean {
        return AuthModule.isAuthenticated;
    }

    updated() {
      if (this.isLoggedIn) {
        UserModule.userRequest();
      }
    }

    public backToTop() {
      //ToDo
    }
  }
</script>
