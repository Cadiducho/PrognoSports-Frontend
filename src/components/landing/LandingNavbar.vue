<template>
    <div id="landingNavbar">
        <nav class="navbar navbar-light bg-light static-top">
            <div class="container">
                <router-link class="navbar-brand" to="/">
                    <img src="@/assets/logo.png" class="navbar-brand-image d-inline-block align-top mr-2" alt/>
                    PrognoSports
                </router-link>
                <section>
                    <router-link to="/login" class="btn btn-primary" style="margin-right: 0.2em">Iniciar sesión</router-link>
                    <router-link to="/register" class="btn btn-outline-primary">Registrarse</router-link>
                </section>
            </div>
        </nav>
    </div>
</template>


<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";

    @Component
    export default class LandingNavbar extends Vue {

    }
</script>