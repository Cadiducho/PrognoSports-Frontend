<template>
    <nav role="navigation" aria-label="main navigation" class="navbar is-light">
        <div class="navbar-brand">
            <router-link to="/" class="navbar-item router-link-active">
                <img src="@/assets/logo_navbar.png" class="mr-3 ml-2" alt="PrognoSports.com">
                PrognoSports
            </router-link>

            <a role="button" class="navbar-burger" :class="{ 'is-active': isActive }" @click="isActive = !isActive"
               aria-label="menu" aria-expanded="false" data-target="prognoLandingNavbar">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="prognoLandingNavbar" class="navbar-menu" :class="{ 'is-active': isActive }">
            <div class="navbar-start">
                <a href="/home" class="navbar-item">
                    Inicio
                </a>
            </div>
            <div class="navbar-end">
                <div v-if="!isLoggedIn" class="navbar-item">
                    <div class="buttons">
                        <router-link class="button is-primary" to="/register">
                            <strong>Registrarse</strong>
                        </router-link>
                        <router-link class="button is-primary is-outlined" to="/login">
                            Iniciar sesión
                        </router-link>
                    </div>
                </div>
                <div v-else class="navbar-item">
                    <div class="buttons">
                        <CommunitiesDropdown v-if="isValidCommunity(currentCommunity)"/>
                        <AvatarComponent/>
                    </div>
                </div>
            </div>
        </div>
    </nav>
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

        isActive: boolean = false;
    }
</script>