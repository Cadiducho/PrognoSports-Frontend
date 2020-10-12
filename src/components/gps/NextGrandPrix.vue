<template>
    <div id="cardNextGP">
        <div class="tile" v-if="!loadingGpData">
            <article class="tile is-child box">
                <p class="title">Próximo Gran Premio</p>
                <p class="subtitle">{{nextGp.name}}</p>
                <figure class="image is-4by3">
                    <img v-if="nextGp.promo_image_url !== undefined" :src="nextGp.promo_image_url">
                </figure>
                <div class="content block">
                    {{nextGp.laps}} vueltas a {{nextGp.circuit.name}}.
                    <!-- ToDo: Fecha, tiempo restante -->
                </div>
                <footer class="card-footer">
                    <b-button tag="router-link"
                              :to="gpLink"
                              type="is-info is-light" expanded>
                        Pronosticar
                    </b-button>
                </footer>
            </article>
        </div>
        <div class="tile" v-else>
            <article class="tile is-child box">
                <p class="title">Próximo Gran Premio</p>
                <loading />
            </article>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {GrandPrix} from "@/types/GrandPrix";
    import {grandPrixService} from "@/_services";
    import {Community} from "@/types/Community";
    import {CommunityModule} from "@/_store/modules/CommunityModule";
    import {namespace} from 'vuex-class'

    const community = namespace('community')

    @Component
    export default class NextGrandPrix extends Vue {
        private nextGp?: GrandPrix;
        private loadingGpData: boolean = true;
        @community.Getter getCurrentCommunity?: Community;


        get gpLink(): any {
            return {
                name: "gpdetails",
                params: {
                    competition: this.getCurrentCommunity!.competition.code,
                    season: this.nextGp?.season.name,
                    id: this.nextGp?.id,
                }
            };
        }

        mounted() {
            CommunityModule.communityRequest().then(() => {
                grandPrixService.getNextGrandPrix(this.getCurrentCommunity!.competition).then(nextGp => {
                    this.nextGp = nextGp;
                }).finally(() => this.loadingGpData = false);
            });
        }
    }
</script>