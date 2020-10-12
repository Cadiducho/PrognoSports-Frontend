<template>
  <div id="app">
    <div v-if="this.isLoggedIn">
      <!-- App cargada e iniciada sesión -->

        <navbar />

        <div class="section">
            <div class="columns">
                <div class="column">
                    <div class="container is-fluid">

                        <nav class="breadcrumb" aria-label="breadcrumbs">
                            <ul>
                                <li><a href="#">PrognoSports</a></li>
                                <li class="is-active"><a href="#" aria-current="page">Inicio</a></li>
                            </ul>
                        </nav>
                        <div class="notification has-background-warning">Estás utilizando PrognoSports Beta, la experiencia puede verse afectada</div>

                        <router-view/>
                    </div>
                </div>
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

</style>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";

  import navbar from "@/components/navbar/Navbar.vue";
  import {UserModule} from "@/_store/modules/UserModule";
  import {AuthModule} from "@/_store/modules/AuthModule";

  @Component({
    components: {
      navbar,
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
  }
</script>
