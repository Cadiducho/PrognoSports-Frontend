<template>
  <div id="app">
    <div v-if="this.isAuthenticated">
      <!-- App cargada e iniciada sesión -->
      <div class="prognosports-container">

        <navbar />
        <sidebar :active-page="this.$route.name" />

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
  import { namespace } from 'vuex-class';
  const auth = namespace('auth');
  const user = namespace('user');
  const community = namespace('community');

  import UserTypes from "@/_store/types/UserTypes.ts";
  import CommunityTypes from "@/_store/types/CommunityTypes.ts";

  import navbar from "@/components/navbar/Navbar.vue";
  import sidebar from "@/components/sidebar/Sidebar.vue";

  @Component({
    components: {
      navbar,
      sidebar
    }
  })
  export default class App extends Vue {
    @user.Action(UserTypes.actions.USER_REQUEST) actionUserRequest: any;
    @community.Action(CommunityTypes.actions.COMMUNITY_REQUEST) actionCommunityRequest: any;
    @auth.Getter isAuthenticated!: boolean;

    created() {
      if (this.isAuthenticated) {
        this.actionUserRequest();
        this.actionCommunityRequest();
      }
    }

    public backToTop() {
      //ToDo
    }
  }
</script>
