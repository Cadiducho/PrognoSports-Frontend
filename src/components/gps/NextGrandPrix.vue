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

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import {GrandPrix} from "@/types/GrandPrix";
    import {Competition} from "@/types/Competition";
    import {GrandPrixesModule} from "@/_store/modules/GrandPrixesModule";

    @Component
    export default class NextGrandPrix extends Vue {
        private nextGp: GrandPrix = GrandPrixesModule.nextGp;
        private isLoadingNextGp: boolean = GrandPrixesModule.isLoadingNextGrandPrix;
        @Prop() competition!: Competition;

        get gpLink(): any {
            return {
                name: "gpdetails",
                params: {
                    competition: this.competition.code,
                    season: this.nextGp.season.name,
                    id: this.nextGp.id,
                }
            };
        }

        mounted() {
            GrandPrixesModule.fetchNextGrandPrix(this.competition);
        }
    }
</script>