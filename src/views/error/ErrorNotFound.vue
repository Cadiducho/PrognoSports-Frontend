<template>
    <section class="section">
        <div class="container">
            <div class="columns is-vcentered">
                <div class="column has-text-centered">
                    <h1 class="title">404 Página no encontrada</h1>
                    <p class="subtitle">Esta página no ha sido encontrada. Vuelve a inicio o inténtalo de nuevo.</p>

                    <b-button @click="back()" class="mr-2" type="is-danger" outlined>Atrás</b-button>
                    <b-button tag="router-link" type="is-primary" to="/">Inicio</b-button>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";

    @Component
    export default class ErrorNotFound extends Vue {
        back() {
            this.$router.go(-1);
        }
    }
</script>