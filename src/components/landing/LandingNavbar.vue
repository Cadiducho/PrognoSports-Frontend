<template>
    <b-navbar type="is-light">
        <template slot="brand">
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
                <img src="@/assets/logo_navbar.png" class="mr-3 ml-2" alt="PrognoSports.com">
                PrognoSports
            </b-navbar-item>
        </template>
        <template slot="start">
            <b-navbar-item v-if="isLoggedIn" tag="router-link" to="/home">
                Inicio
            </b-navbar-item>
        </template>

        <template slot="end">
            <b-navbar-item tag="div" v-if="!isLoggedIn">
                <div class="buttons">
                    <router-link class="button is-primary" to="/register">
                        <strong>Registrarse</strong>
                    </router-link>
                    <router-link class="button is-primary is-outlined" to="/login">
                        Iniciar sesión
                    </router-link>
                </div>
            </b-navbar-item>
            <template v-else>
                <CommunitiesDropdown v-if="isValidCommunity(currentCommunity)"/>
                <AvatarComponent/>
            </template>
        </template>
    </b-navbar>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {namespace} from "vuex-class";
    import AvatarComponent from "@/components/navbar/AvatarComponent.vue";
    import {Community} from "@/types/Community";
    import CommunitiesDropdown from "@/components/navbar/CommunitiesDropdown.vue";

    const Auth = namespace("Auth");

    @Component({
        components: {
            AvatarComponent,
            CommunitiesDropdown
        }
    })
    export default class LandingNavbar extends Vue {
        @Auth.Getter private isLoggedIn!: boolean;
        @Auth.State("community") private currentCommunity!: Community;
    }
</script>