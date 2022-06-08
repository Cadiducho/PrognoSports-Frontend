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
                    <o-tabs v-model="activeTab">
                        <o-tab-item v-for="(session, index) in grandPrix.sessions"
                                    :label="session.humanName()"
                                    :key="session.name"
                                    :value="index">
                            <h6 class="font-weight-light">La hora de cierre de este pronóstico para la <strong>{{ session.humanName() }}</strong>
                                es {{ humanDateTimeMinusFiveMinutes(session.date) }}</h6>
                            <SelectTipps :session="session"
                                         :grand-prix="grandPrix"
                                         :rule-set="ruleSet"
                                         :drivers="drivers"
                                         :startGrids="startGrid"
                            />
                        </o-tab-item>
                    </o-tabs>
                </div>
                <div v-if="thereIsGrid" class="content column">
                    <StartGrid :grid="startGrid"/>
                </div>
                <div class="column is-3">
                    <CircuitCard :circuit="grandPrix.circuit" :laps="grandPrix.laps" />
                    <PitLaneStartGrid v-if="thereIsGrid" :grid="startGrid"/>
                </div>
            </div>

            <o-tabs v-model="activeTab">
                <o-tab-item v-for="(session, index) in grandPrix.sessions"
                            :label="session.humanName()"
                            :key="session.name"
                            :value="index">
                    <h6 class="font-weight-light">La hora de cierre de este pronóstico para la <strong>{{ session.humanName() }}</strong>
                        es {{ humanDateTimeMinusFiveMinutes(session.date) }}</h6>
                    <ScoreComponents :gp="grandPrix"
                                     :rule-set="ruleSet"
                                     :session="session"
                                     :communityMembers="communityMembers"
                                     :user-points="userPoints"/>
                </o-tab-item>
            </o-tabs>
        </div>
    </div>
</template>

<script lang="ts">
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import GrandPrixPagination from "@/components/gps/GrandPrixPagination.vue";
import CircuitCard from "@/components/gps/CircuitCard.vue";
import StartGrid from "@/components/gps/StartGridList.vue";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";
import {GrandPrix} from "@/types/GrandPrix";
import {communityService, driversService, grandPrixService, rulesetService, scoreService} from "@/_services";
import {StartGridPosition} from "@/types/StartGridPosition";
import SelectTipps from "@/components/gps/SelectTipps.vue";
import PitLaneStartGrid from "@/components/gps/PitLaneStartGrid.vue";
import ScoreComponents from "@/components/gps/ScoreComponent.vue";
import {UserPoints} from "@/types/UserPoints";
import {Dictionary} from "@/types/Dictionary";
import dayjs from "dayjs";
import {RaceSession} from "@/types/RaceSession";
import {RuleSet} from "@/types/RuleSet";
import {Driver} from "@/types/Driver";
import {CommunityUser} from "@/types/CommunityUser";

import {defineComponent} from "vue";
import {useCommunityStore} from "@/store/communityStore";
import useEmitter from "@/composables/useEmitter";
import {useDayjs} from "@/composables/useDayjs";

export default defineComponent({
    name: "ViewOneGrandPrix",
    components: {
        ScoreComponents,
        PitLaneStartGrid,
        SelectTipps,
        CircuitCard,
        PrognoPageTitle,
        GrandPrixPagination,
        StartGrid
    },
    setup() {
        const dayjs = useDayjs();
        const emitter = useEmitter();
        const communityStore = useCommunityStore();

        const humanDateTimeMinusFiveMinutes = dayjs.humanDateTimeMinusFiveMinutes;
        const currentCommunity = communityStore.community;
        return {currentCommunity, emitter};
    },
    data() {
        return {
            competition: {code: this.$route.params.competition} as Competition,
            season: {name: this.$route.params.season} as Season,
            id: this.$route.params.id as string,

            grandPrix: {} as GrandPrix,
            ruleSet: {} as RuleSet,
            drivers: new Array<Driver>(),
            communityMembers: new Array<CommunityUser>(),

            isLoadingGrandPrix: true,
            startGrid: new Map<RaceSession, Array<StartGridPosition>>(),
            userPoints: {} as Dictionary<number, UserPoints>,
            activeTab: 0
        }
    },
    mounted() {
        grandPrixService.getGrandPrix(this.competition, this.season, this.id).then(gp => {
            this.grandPrix = gp;

            if (this.grandPrix) {
                this.emitter.emit('breadcrumbLastname', this.grandPrix.name + ' de ' + this.grandPrix.season.name);

                Promise.all([
                    driversService.getDriversInGrandPrix(this.grandPrix!),
                    rulesetService.getRuleSetInGrandPrix(this.currentCommunity, this.grandPrix),
                    scoreService.getPointsInGrandPrix(this.currentCommunity, this.grandPrix!),
                    communityService.getMembers(this.currentCommunity),
                    this.getStartGrids(this.grandPrix)
                ]).then(result => {
                    this.drivers = result[0];
                    this.ruleSet = result[1];
                    const points = result[2];
                    this.communityMembers = result[3];
                    const rawStartGrids = result[4];

                    points.forEach((points) => {
                        this.userPoints[points.user.id] = points;
                    });

                    rawStartGrids.forEach((grid, index) => {
                        const session = this.grandPrix!.sessions[index];
                        if (grid.length > 0) {
                            this.startGrid.set(session, grid);
                        }
                    });

                    this.isLoadingGrandPrix = false;
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
    },
    methods: {
        async getStartGrids(grandPrix: GrandPrix): Promise<StartGridPosition[][]> {
            const request = [];
            for await (const session of grandPrix.sessions) {
                request.push(grandPrixService.getGrandPrixGrid(this.grandPrix!, session));
            }
            return Promise.all(request);
        }
    },
    computed: {
        thereIsGrid(): boolean {
            return this.startGrid.size !== 0
        }
    }
});
</script>