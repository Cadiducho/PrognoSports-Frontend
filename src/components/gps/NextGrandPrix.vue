<template>
    <div class="card" id="cardNextGP">
        <div class="card-header d-flex justify-content-between align-items-center">
            <div class="card-header-title">Próximo Gran Premio</div>
        </div>
        <template v-if="isLoadingNextGp">
            <loading />
        </template>
        <template v-else>
            <img class="card-img-top" v-if="nextGp.promo_image_url !== undefined" :src="nextGp.promo_image_url" alt="Circuit image">
            <div class="card-body">
                <template v-if="nextGp !== undefined">
                    <h4 class="card-title"> {{nextGp.name}}</h4>
                    <h6 id="gpLeftTime"></h6>
                    <p class="card-text"> {{nextGp.laps}} vueltas a {{nextGp.circuit.name}}.</p>
                    <router-link :to="gpLink" class="btn btn-primary">Pronosticar</router-link>
                </template>
                <template v-else>
                    No hay siguiente Gran Premio a la vista
                </template>
            </div>
        </template>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import {FETCH_NEXT_GP} from "@/_store/actions.type";

    export default {
        name: "NextGrandPrix",
        computed: {
            gpLink() {
                return {
                    name: "gpdetails",
                    params: {
                        season: this.nextGp.season,
                        id: this.nextGp.id,
                    }
                };
            },
            ...mapGetters(["isLoadingNextGp", "nextGp"])
        },
        mounted() {
            this.fetchNextGP();
        },
        methods: {
            fetchNextGP() {
                this.$store.dispatch(FETCH_NEXT_GP);
            }
        }
    }
</script>