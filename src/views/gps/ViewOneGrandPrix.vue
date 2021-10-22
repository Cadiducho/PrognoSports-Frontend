<template>
    <div id="grandprix">
        <div v-if="isLoadingGrandPrix || grandPrix === undefined">
            <loading />
        </div>
        <div v-else>
            <div class="columns is-variable is-5">
                <div class="column">
                    <PrognoPageTitle :name="grandPrix.name + ' de ' + grandPrix.season.name" />
                </div>
                <div class="column is-3">
                    <GrandPrixPagination :competition="competition" :grand-prix="grandPrix"/>
                </div>
            </div>

            <div class="columns">
                <div v-bind:class="thereIsGrid ? 'column is-6' : 'column is-9'">
                    <b-tabs v-model="activeTab">
                        <b-tab-item label="Clasificación">
                            <h6 class="font-weight-light">La hora de cierre de este pronóstico para la <strong>clasificación</strong> es {{grandPrix.qualiTime | humanDateTimeMinusFiveMinutes}}</h6>
                            <SelectTipps session="QUALIFY"
                                        :grand-prix="grandPrix"/>
                        </b-tab-item>
                        <b-tab-item label="Carrera">
                            <h6 class="font-weight-light">La hora de cierre de este pronóstico para la <strong>carrera</strong> es {{grandPrix.raceTime | humanDateTimeMinusFiveMinutes}}</h6>
                            <SelectTipps session="RACE"
                                         :grand-prix="grandPrix"/>
                        </b-tab-item>
                    </b-tabs>
                </div>
                <div v-if="thereIsGrid" class="content column">
                    <StartGrid :grid="startGrid"/>
                </div>
                <div class="column is-3">
                    <CircuitCard :circuit="grandPrix.circuit" :laps="grandPrix.laps" />
                    <PitLaneStartGrid :grid="startGrid"/>
                </div>
            </div>

            <b-tabs v-model="activeTabResults">
                <b-tab-item label="Clasificación">
                   <ScoreComponents :gp="grandPrix"
                                    session="QUALIFY"
                                    :user-points="userPoints"/>
                </b-tab-item>
                <b-tab-item label="Carrera">
                   <ScoreComponents :gp="grandPrix"
                                    session="RACE"
                                    :user-points="userPoints"/>
                </b-tab-item>
            </b-tabs>
        </div>
    </div>
</template>

<script lang="ts">
    import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
    import GrandPrixPagination from "@/components/gps/GrandPrixPagination.vue";
    import CircuitCard from "@/components/gps/CircuitCard.vue";
    import StartGrid from "@/components/gps/StartGridList.vue";
    import {Component, Vue} from "vue-property-decorator";
    import {Competition} from "@/types/Competition";
    import {Season} from "@/types/Season";
    import {GrandPrix} from "@/types/GrandPrix";
    import {communityService, driversService, grandPrixService, scoreService} from "@/_services";
    import {StartGridPosition} from "@/types/StartGridPosition";
    import SelectTipps from "@/components/gps/SelectTipps.vue";
    import PitLaneStartGrid from "@/components/gps/PitLaneStartGrid.vue";
    import ScoreComponents from "@/components/gps/ScoreComponent.vue";
    import {Community} from "@/types/Community";
    import {namespace} from "vuex-class";
    import {UserPoints} from "@/types/UserPoints";
    import {Dictionary} from "@/types/Dictionary";
    import {CommunityUser} from "@/types/CommunityUser";
    import {Driver} from "@/types/Driver";
    import EventBus from "@/plugins/eventbus";
    const Auth = namespace('Auth')

    @Component({
        components: {
            ScoreComponents,
            PitLaneStartGrid,
            SelectTipps,
            CircuitCard,
            PrognoPageTitle,
            GrandPrixPagination,
            StartGrid
        }
    })
    export default class ViewOneGrandPrix extends Vue {
        @Auth.State("community") private currentCommunity!: Community;

        private competition: Competition = { code: this.$route.params.competition } as Competition;
        private season: Season = {name: this.$route.params.season } as Season;
        private id: string = this.$route.params.id;

        private grandPrix?: GrandPrix;
        private isLoadingGrandPrix: boolean = true;
        private thereIsGrid: boolean = false;
        private startGrid: Array<StartGridPosition> = [];
        private userPoints: Dictionary<number, UserPoints> = {};

        private activeTab: number = 0;
        private activeTabResults: number = 0;

        mounted() {
            grandPrixService.getGrandPrix(this.competition, this.season, this.id)
                .then(gp => {
                    this.grandPrix = gp;
                    this.isLoadingGrandPrix = false;
                }).then(() => {
                    if (this.grandPrix) {
                        driversService.getDriversInGrandPrix(this.grandPrix!).then((drivers) => {
                            EventBus.$emit('sendDriversInGrandPrix', drivers);
                        });

                        grandPrixService.getGrandPrixGrid(this.competition, this.season, this.id).then((grid) => {
                            this.startGrid.push(...grid);
                            if (this.startGrid.length !== 0) {
                                this.thereIsGrid = true;
                            }
                        });

                        scoreService.getPointsInGrandPrix(this.currentCommunity, this.grandPrix!).then((points) => {
                            points.forEach((userPoints) => {
                                this.userPoints[userPoints.user.id] = userPoints;
                            });
                        });

                        communityService.getMembers(this.currentCommunity).then((members) => {
                            EventBus.$emit('sendCommunityMembers', members);
                        });
                    }
                });
        }
    }
</script>