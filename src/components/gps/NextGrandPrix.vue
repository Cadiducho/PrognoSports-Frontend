<template>
    <div id="cardNextGP">
        <div class="tile" v-if="noNextGp">
            <article class="tile is-child box">
                <p class="title">Próximo Gran Premio</p>
                <p class="content block">
                    No hay próximo Gran Premio
                </p>
            </article>
        </div>
        <div class="tile" v-else-if="!loadingGpData">
            <article class="tile is-child box">
                <p class="title">Próximo Gran Premio</p>
                <p class="subtitle">{{nextGp.name}}</p>
                <figure class="image is-4by3">
                    <img v-if="nextGp.promo_image_url !== undefined" :src="nextGp.promo_image_url">
                </figure>
                <p class="content block">
                    {{nextGp.laps}} vueltas a {{nextGp.circuit.name}}.
                </p>
                <p class="content block">
                    Clasificación: {{nextGp.qualiTime | humanDate }} ({{nextGp.qualiTime | dateDiff }}) <br>
                    Carrera: {{nextGp.raceTime | humanDate }} ({{nextGp.raceTime | dateDiff }})
                </p>
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
    import {Component, Vue, Watch} from "vue-property-decorator";
    import {GrandPrix} from "@/types/GrandPrix";
    import {grandPrixService} from "@/_services";
    import {Community} from "@/types/Community";
    import {namespace} from 'vuex-class'
    const Auth = namespace('Auth')

    @Component
    export default class NextGrandPrix extends Vue {
        private nextGp?: GrandPrix;
        private noNextGp: boolean = false;
        private loadingGpData: boolean = true;
        @Auth.State("community") private currentCommunity!: Community;
        get gpLink(): any {
            return {
                name: "gpdetails",
                params: {
                    competition: this.currentCommunity.competition.code,
                    season: this.nextGp?.season.name,
                    id: this.nextGp?.id,
                }
            };
        }

        mounted() {
            if (this.currentCommunity) {
                this.fetchNextGrandPrixData();
            }
        }

        @Watch('currentCommunity')
        onCurrentCommunityChange(community: Community) {
            this.fetchNextGrandPrixData();
        }

        fetchNextGrandPrixData() {
            grandPrixService.getNextGrandPrix(this.currentCommunity.competition).then(nextGp => {
                this.nextGp = nextGp;
            }).catch(() => {
                this.noNextGp = true;
            }).finally(() => this.loadingGpData = false);
        }
    }
</script>