<template>
    <div id="grandprix">
        <loading v-if="isLoadingGrandPrix" />
        <p v-else-if="!thereIsGrandPrix">El Gran Premio buscado con nombre <i>{{ id }}</i> no ha sido encontrado</p>

        <template v-else>
            <div class="columns is-variable is-5">
                <div class="column">
                    <PTitle :name="grandPrix.name + ' de ' + grandPrix.season.name" />
                </div>
                <div class="column is-3">
                    <GrandPrixPagination :competition="competition" :grand-prix="grandPrix"/>
                </div>
            </div>


            <article v-if="!grandPrix.sessions || !grandPrix.sessions.length" class="notification is-warning">
                No hay sesiones configuradas en este Gran Premio
            </article>

            <div class="columns">

                <div v-bind:class="startGrid.size ? 'column is-6' : 'column is-9'">
                    <o-tabs v-model="activeTab">
                        <o-tab-item v-for="(session, index) in grandPrix.sessions"
                                    :label="session.humanName()"
                                    :key="session.id"
                                    :value="index">
                            <h6 class="dark:text-gray-300">
                                La hora de cierre de este pronóstico para la <span class="font-bold dark:text-gray-200">{{ session.humanName() }}</span>
                                es {{ humanDateTime(session.closureDate()) }} ({{ dateDiff(session.closureDate()) }})
                            </h6>
                            <h6 class="dark:text-gray-300">
                                Para esta sesión se han de pronosticar {{ ruleSet.cantidadPilotosPronosticados(session) }} pilotos
                            </h6>
                            <SelectTipps :session="session"
                                         :grand-prix="grandPrix"
                                         :rule-set="ruleSet"
                                         :drivers="drivers"
                                         :startGrids="startGrid"
                            />
                        </o-tab-item>
                    </o-tabs>
                </div>
                <div v-if="startGrid.size" class="content column">
                    <StartGrid :grid="startGrid"/>
                </div>
                <div class="column is-3">
                    <CircuitCard v-if="grandPrix.circuit && grandPrix.variant"
                                 :circuit="grandPrix.circuit!" :variant="grandPrix.variant!" :laps="grandPrix.laps"
                    />
                    <PitLaneStartGrid v-if="startGrid.size" :grid="startGrid"/>

                    <section v-if="currentUser.isAdmin()" class="mt-2">
                        <hr/>
                        <o-button variant="primary" expanded tag="router-link"
                                  :to="{ name: 'adminGpEditInSeason', params: {season: season.name, gp: grandPrix.id} } ">
                            Administración
                        </o-button>
                    </section>
                </div>
            </div>

            <o-tabs v-model="activeTab">
                <o-tab-item v-for="(session, index) in grandPrix.sessions"
                            :label="session.humanName()"
                            :key="session.id"
                            :value="index">
                    <h6 class="dark:text-gray-300">
                        La hora de cierre de este pronóstico para la <span class="font-bold dark:text-gray-200">{{ session.humanName() }}</span>
                        es {{ humanDateTime(session.closureDate()) }} ({{ dateDiff(session.closureDate()) }})
                    </h6>
                    <ScoreComponents :gp="grandPrix"
                                     :rule-set="ruleSet"
                                     :session="session"
                                     :communityMembers="communityMembers"
                                     :user-points="userPoints"/>
                </o-tab-item>
            </o-tabs>
        </template>
    </div>
</template>

<script lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import GrandPrixPagination from "@/components/gps/GrandPrixPagination.vue";
import CircuitCard from "@/components/gps/CircuitCard.vue";
import StartGrid from "@/components/gps/StartGridList.vue";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";
import {GrandPrix} from "@/types/GrandPrix";
import {communityService, driversService, grandPrixService, notificationService, rulesetService, scoreService} from "@/_services";
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
import Loading from "@/components/lib/Loading.vue";
import {useAuthStore} from "@/store/authStore";

export default defineComponent({
    name: "OneGrandPrix",
    components: {
        Loading,
        ScoreComponents,
        PitLaneStartGrid,
        SelectTipps,
        CircuitCard,
        PTitle,
        GrandPrixPagination,
        StartGrid
    },
    setup() {
        const dayjs = useDayjs();
        const emitter = useEmitter();
        const authStore = useAuthStore();
        const communityStore = useCommunityStore();

        const dateDiff = dayjs.dateDiff;
        const humanDateTime = dayjs.humanDateTime;
        const currentCommunity = communityStore.currentCommunity;
        const currentUser = authStore.loggedUser;
        return {currentUser, currentCommunity, emitter, humanDateTime, dateDiff};
    },
    data() {
        return {
            competition: {code: this.$route.params.competition} as Competition,
            season: {name: this.$route.params.season} as Season,
            id: this.$route.params.gp as string,

            grandPrix: {} as GrandPrix,
            ruleSet: {} as RuleSet,
            drivers: new Array<Driver>(),
            communityMembers: new Array<CommunityUser>(),

            isLoadingGrandPrix: true,
            thereIsGrandPrix: false,
            startGrid: new Map<RaceSession, Array<StartGridPosition>>(),
            userPoints: {} as Dictionary<number, UserPoints>,
            activeTab: 0
        }
    },
    mounted() {
        grandPrixService.getGrandPrixInSeason(this.season, this.id).then(gp => {
            this.grandPrix = gp;

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


                this.thereIsGrandPrix = true;

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

        }).catch((error) => {
            this.thereIsGrandPrix = false;
            this.isLoadingGrandPrix = false;
            notificationService.showNotification(error.message, 'error');
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
});
</script>