<template>
    <div class="card" id="cardNextGP">
        <div class="card-header d-flex justify-content-between align-items-center">
            <div class="card-header-title">Próximo Gran Premio</div>
        </div>
        <template v-if="loaded === false">
            <loading />
        </template>
        <template v-else>
            <img class="card-img-top" v-if="nextGrandPrix.promo_image_url !== undefined" :src="nextGrandPrix.promo_image_url" alt="Circuit image">
            <div class="card-body">
                <template v-if="nextGrandPrix !== undefined">
                    <h4 class="card-title"> {{nextGrandPrix.name}}</h4>
                    <h6 id="gpLeftTime"></h6>
                    <p class="card-text"> {{nextGrandPrix.laps}} vueltas a {{nextGrandPrix.circuit.name}}.</p>
                    <router-link :to="'/gps/' + nextGrandPrix.season + '/' + nextGrandPrix.name" class="btn btn-primary">Pronosticar</router-link>
                </template>
                <template v-else>
                    No hay siguiente Gran Premio a la vista
                </template>
            </div>
        </template>
    </div>
</template>

<script>
    import {grandPrixService} from "@/_services";

    export default {
        name: "NextGrandPrix",
        data() {
            return {
                loaded: false,
                nextGrandPrix: {}
            }
        },
        created() {
            grandPrixService.getNextGrandPrix().then(
                gp => {
                    this.nextGrandPrix = gp;
                    this.loaded = true;
                },
                error => {
                    this.nextGrandPrix = {};
                    this.loaded = true;
                }
            );
        },
    }
</script>

<style scoped>

</style>