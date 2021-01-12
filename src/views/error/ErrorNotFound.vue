<template>
    <div id="notfound" class="box">
        <section class="section is-medium">
            <div class="container">
                <div class="columns is-vcentered">
                    <div class="column has-text-centered">
                        <h1 class="title">404 Página no encontrada</h1>
                        <p class="subtitle">Esta página no ha sido encontrada. Vuelve a inicio o intentalo de nuevo.</p>
                        <router-link to="/home" class="button">Inicio</router-link>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";

    @Component({components: {PrognoPageTitle}})
    export default class ErrorNotFound extends Vue {

    }
</script>

<style scoped>

</style>