<template>
    <b-navbar type="is-light">
        <template slot="brand">
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
                <img src="@/assets/logo_navbar.png" class="mr-3 ml-2" alt="PrognoSports.com">
                PrognoSports
            </b-navbar-item>
        </template>
        <template slot="start">
            <!--<b-navbar-item href="#">
                Home
            </b-navbar-item>
            <b-navbar-item href="#">
                Documentation
            </b-navbar-item>
            <b-navbar-dropdown label="Info">
                <b-navbar-item href="#">
                    About
                </b-navbar-item>
                <b-navbar-item href="#">
                    Contact
                </b-navbar-item>
            </b-navbar-dropdown>-->
        </template>

        <template slot="end">
            <b-navbar-item tag="div">
                <div class="buttons">
                    <router-link class="button is-primary" to="/register">
                        <strong>Registrarse</strong>
                    </router-link>
                    <router-link class="button is-primary is-outlined" to="/login">
                        Iniciar sesión
                    </router-link>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";

    @Component
    export default class LandingNavbar extends Vue {

    }
</script>

<style scoped>
.navbar-prognosports {
    font-size: 1.25rem;
    white-space: nowrap;
    line-height: inherit;
    font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-weight: 700;
}
</style>