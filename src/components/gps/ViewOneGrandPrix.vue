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
                        <b-tab-item v-for="session in grandPrix.sessions"
                                    :label="session.humanName()"
                                    :key="session.name">
                            <h6 class="font-weight-light">La hora de cierre de este pronóstico para la <strong>{{ session.humanName() }}</strong>
                                es {{session.date | humanDateTimeMinusFiveMinutes}}</h6>
                            <SelectTipps :session="session" :grand-prix="grandPrix" :rule-set="ruleSet" :drivers="drivers" />
                        </b-tab-item>
                    </b-tabs>
                </div>
                <div v-if="thereIsGrid" class="content column">
                    <StartGrid :grid="startGrid"/>
                </div>
                <div class="column is-3">
                    <CircuitCard :circuit="grandPrix.circuit" :laps="grandPrix.laps" />
                    <PitLaneStartGrid v-if="thereIsGrid" :grid="startGrid"/>
                </div>
            </div>

            <b-tabs v-model="activeTab">
                <b-tab-item v-for="session in grandPrix.sessions"
                            :label="session.humanName()"
                            :key="session.name">
                    <h6 class="font-weight-light">La hora de cierre de este pronóstico para la <strong>{{ session.humanName() }}</strong>
                        es {{session.date | humanDateTimeMinusFiveMinutes}}</h6>
                    <ScoreComponents :gp="grandPrix"
                                     :rule-set="ruleSet"
                                     :session="session"
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
import {communityService, driversService, grandPrixService, rulesetService, scoreService} from "@/_services";
import {StartGridPosition} from "@/types/StartGridPosition";
import SelectTipps from "@/components/gps/SelectTipps.vue";
import PitLaneStartGrid from "@/components/gps/PitLaneStartGrid.vue";
import ScoreComponents from "@/components/gps/ScoreComponent.vue";
import {Community} from "@/types/Community";
import {namespace} from "vuex-class";
import {UserPoints} from "@/types/UserPoints";
import {Dictionary} from "@/types/Dictionary";
import EventBus from "@/plugins/eventbus";
import dayjs from "dayjs";
import {RaceSession} from "@/types/RaceSession";
import {RuleSet} from "@/types/RuleSet";
import {Driver} from "@/types/Driver";

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
        private ruleSet?: RuleSet;
        private drivers?: Array<Driver> = [];

        private isLoadingGrandPrix: boolean = true;
        private thereIsGrid: boolean = false;
        private startGrid: Map<RaceSession, Array<StartGridPosition>> = new Map();
        private userPoints: Dictionary<number, UserPoints> = {};

        private activeTab: number = 0;

        mounted() {
            grandPrixService.getGrandPrix(this.competition, this.season, this.id)
                .then(gp => {
                    this.grandPrix = gp;

                    if (this.grandPrix) {
                        EventBus.$emit('breadcrumbLastname', this.grandPrix.name + ' de ' + this.grandPrix.season.name);

                        Promise.all([
                            driversService.getDriversInGrandPrix(this.grandPrix!),
                            rulesetService.getRuleSetInGrandPrix(this.currentCommunity, this.grandPrix)
                        ]).then(result => {
                            this.drivers = result[0];

                            this.ruleSet = result[1];
                            this.isLoadingGrandPrix = false;
                            EventBus.$emit('sendDriversInGrandPrix', this.drivers);
                        });

                        this.getStartGrids(this.grandPrix);

                        scoreService.getPointsInGrandPrix(this.currentCommunity, this.grandPrix!).then((points) => {
                            points.forEach((userPoints) => {
                                this.userPoints[userPoints.user.id] = userPoints;
                            });
                        });

                        communityService.getMembers(this.currentCommunity).then((members) => {
                            EventBus.$emit('sendCommunityMembers', members);
                        });


                        // Colocar la tab correcta según si es día de clasificación o carrera
                        this.grandPrix.sessions.forEach((ses, index) => {
                            if (dayjs(ses.date).isToday()) {
                                this.activeTab = index;
                                return;
                            }
                        })
                    }
                });
        }

        async getStartGrids(grandPrix: GrandPrix) {
            const request = [];
            for await (const session of grandPrix.sessions) {
                request.push(grandPrixService.getGrandPrixGrid(this.grandPrix!, session));
            }

            Promise.all(request).then((result) => {
                result.forEach((grid, index) => {
                    const session = grandPrix.sessions[index];
                    if (grid.length > 0) {
                        this.startGrid.set(session, grid);
                    }
                    EventBus.$emit('sendStartGrid', {session, grid});
                });

                if (this.startGrid.size !== 0) {
                    this.thereIsGrid = true;
                }
            });
        }
    }
</script>