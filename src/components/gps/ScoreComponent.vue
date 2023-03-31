<template>
    <div>
        <loading v-if="!loaded" />
        <template v-else>
            <span class="title is-5">Puntuaciones de {{ session.humanName() }} </span> <br/>
            <span class="title is-6">Leyenda</span>
            <p class="content">
                Tus puntuaciones salen reflejadas con color <span class="tag is-primary">verde</span> <br/>
                El ganador del Gran Premio es reflejado con color <span class="tag is-warning">dorado</span> <br/>
                Los ganadores de cada sesión tendrán representado un <o-icon pack="fas" icon="trophy"></o-icon>
            </p>

            <o-notification v-if="currentUser.preferences['hide-tipps-until-start'] === true" variant="info is-light" aria-close-label="Close notification">
                Tus pronósticos están ocultos al resto de usuarios hasta {{ humanDateTime(session.closureDate()) }} ({{ dateDiff(session.closureDate()) }})
            </o-notification>
            <o-notification v-if="!thereAreFinishResults" variant="primary is-light" aria-close-label="Close notification">
                Aún no hay resultados confirmados para esta sesión
            </o-notification>

            <o-table :data="tableData"
                     hoverable
                     :mobile-cards="false"
                     default-sort="score.accumulated"
                     default-sort-direction="DESC"
                     :row-class="(row, index) => checkRowClass(row)"
            >

                <o-table-column field="score.standings" label="Pos." width="80" sortable numeric>
                    <template v-slot="props">
                        <!-- Compruebo si ya tiene un nuevo ranking para este GP. En caso de tenerlo, lo comparo con el anterior y añado una flecha de cambio si es necesario -->
                        <!-- Mostrar ranking, si lo tiene (menor que Number.MAX_SAFE_INTEGER) -->
                        <span v-if="props.row.score.standings < Number.MAX_SAFE_INTEGER">


                            <template v-if="props.row.score.standings > 0">

                                {{ props.row.score.standings }}º

                                <!-- Solo puedo añadir flechas si existe un previous -->
                                <template v-if="props.row.score.previousStandings > 0">
                                    <o-tooltip v-if="props.row.score.previousStandings > props.row.score.standings"
                                               :label="'Asciende de ' + props.row.score.previousStandings + 'º a ' + props.row.score.standings + 'º'"
                                               variant="success is-small">
                                        <o-icon pack="fas" variant="success" icon="arrow-up"></o-icon>
                                    </o-tooltip>
                                    <o-tooltip v-if="props.row.score.previousStandings < props.row.score.standings"
                                               :label="'Desciende de ' + props.row.score.previousStandings + 'º a ' + props.row.score.standings + 'º'"
                                               variant="danger is-small">
                                        <o-icon pack="fas" variant="danger" icon="arrow-down"></o-icon>
                                    </o-tooltip>
                                </template>

                                </template>
                                <template v-else>
                                -
                                </template>
                        </span>
                        <!-- Si no hay standings actuales en este gp, pero existe un previo, mostrar ese -->
                        <span v-else-if="props.row.score.previousStandings > 0">
                            {{ props.row.score.previousStandings }}º
                        </span>
                        <!-- en caso contrario no mostrar ningún número, Number.MAX_SAFE_INTEGERº queda raro -->
                        <template v-else>
                            -
                        </template>
                    </template>
                </o-table-column>

                <o-table-column field="user.username" label="Nombre" sortable>
                    <template v-slot="props">
                        <o-tooltip
                            position="right"
                            variant="light">
                            <template v-slot:content>
                                <!-- User mini card -->
                                <UserMiniCard :user="props.row.user" />
                            </template>

                            <span class="has-text-weight-bold">{{ props.row.user.username }}</span>
                        </o-tooltip>
                    </template>
                </o-table-column>

                <o-table-column :visible="showResults"
                                v-for="(position, index) in sessionResults"
                                v-bind:key="position.position" :field="position.driver.code">
                    <template v-slot:header="{ column }">
                        <o-tooltip v-if="position.driver.code !== '---'"
                                   :label="driverTooltip(position.driver)"
                                   append-to-body>
                            {{ index + 1 }}. {{ position.driver.code }}
                        </o-tooltip>
                        <template v-else>
                            {{ index + 1 }}. ---
                        </template>
                    </template>
                    <template v-slot="props">

                        <o-tooltip
                            v-if="props.row.tipps[index] !== undefined"
                            :label="driverTooltip(props.row.tipps[index].driver)"
                            append-to-body>
                            {{ props.row.tipps[index].driver.code }}

                            <sub v-if="pointsByPosition[props.row.user.id] !== undefined
                                        && !!pointsByPosition[props.row.user.id][index + 1] !== undefined"
                                 v-bind:class="{
                                            'has-text-link': pointsByPosition[props.row.user.id][index + 1] > 0,
                                            'has-text-danger': pointsByPosition[props.row.user.id][index + 1] < 0,
                                 }">
                                {{ pointsByPosition[props.row.user.id][index + 1] }}
                            </sub>
                        </o-tooltip>

                        <!-- Si no hay pronóstico para este usuario y posición, se coloca un "---" -->
                        <template v-else>
                            ---
                        </template>
                    </template>
                </o-table-column>

                <o-table-column v-for="session in gp.sessions" :key="session.code"
                                field="score.pointsBySession[session.name]" :label="session.code" sortable numeric v-slot="props">

                    <span v-bind:class="{'has-text-danger': (props.row.score.bySession[session.name] || 0) < 0}">
                        {{ props.row.score.bySession[session.name] || 0 }}
                    </span>

                    <o-tooltip v-if="checkAndInsertTrophy(props.row.user.username, session)"
                               :label="'Ganador de la sesión de ' + session.humanName()"
                               variant="light">
                        <o-icon pack="fas" variant="info" icon="trophy"></o-icon>
                    </o-tooltip>

                </o-table-column>

                <o-table-column field="score.gp" label="GP" sortable numeric v-slot="props">
                    {{ props.row.score.gp }}
                    <o-tooltip v-if="checkAndInsertTrophy(props.row.user.username, undefined)"
                               label="Ganador del Gran Premio"
                               variant="light">
                        <o-icon pack="fas" variant="purple" icon="trophy"></o-icon>
                    </o-tooltip>
                </o-table-column>

                <o-table-column :visible="showAdvancedStadistics"
                    v-for="session in gp.sessions" :key="session.code"
                                field="score.hitPercentageBySession[session.name]" :label="session.code + `%`" sortable numeric v-slot="props">
                    <span v-if="props.row.score.hitPercentageBySession[session.name] >= 0">
                        {{ Number((props.row.score.hitPercentageBySession[session.name] * 100).toFixed(2)) }}%
                    </span>
                    <span v-else>
                        -
                    </span>

                </o-table-column>

                <o-table-column :visible="showAdvancedStadistics"
                    field="score.hitPercentageInGP" label="GP%" sortable numeric v-slot="props">
                    <span v-if="props.row.score.hitPercentageInGP >= 0">
                        {{ Number((props.row.score.hitPercentageInGP * 100).toFixed(2)) }}%
                    </span>
                    <span v-else>
                        -
                    </span>
                </o-table-column>


                <o-table-column field="score.accumulated" label="TOT" sortable numeric v-slot="props">
                    <span class="has-text-weight-bold">{{ props.row.score.accumulated }}</span>
                </o-table-column>
            </o-table>

            <hr />
            <h6 class="subtitle">Opciones de la tabla</h6>
            <section class="is-flex is-flex-direction-column" style="gap: 0.6rem">
                <o-checkbox v-model="showAdvancedStadistics">Mostrar estadísticas avanzadas</o-checkbox>
                <o-checkbox v-model="showResults">Mostrar resultados</o-checkbox>
                <o-checkbox v-model="showColorUser">Mostrar color en tu usuario</o-checkbox>
                <o-checkbox v-model="showColorWinner">Mostrar color en el ganador</o-checkbox>
            </section>
        </template>
    </div>
</template>

<script lang="ts">
import {User} from "@/types/User";
import {RaceSession} from "@/types/RaceSession";
import {grandPrixService, scoreService} from "@/_services";
import {GrandPrix} from "@/types/GrandPrix";
import {RaceResult} from "@/types/RaceResult";
import {Driver} from "@/types/Driver";
import {CommunityUser} from "@/types/CommunityUser";
import UserMiniCard from "@/components/user/UserMiniCard.vue";
import {cantidadPilotosPronosticados} from "@/utils";
import {UserPoints} from "@/types/UserPoints";
import {Dictionary} from "@/types/Dictionary";
import {RuleSet} from "@/types/RuleSet";


interface TableType {
    user: User;
    tipps: Array<RaceResult>;
    score: {
        bySession: Dictionary<string, number>;
        hitPercentageBySession: Dictionary<string, number>;
        gp: number,
        hitPercentageInGP: number;
        accumulated: number,
        standings: number,
        previousStandings: number
    }
}

import {defineComponent, PropType} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import {StartGridPosition} from "@/types/StartGridPosition";
import {useDayjs} from "@/composables/useDayjs";

export default defineComponent({
    name: "LandingNavbar",
    components: {UserMiniCard},
    props: {
        gp: {
            type: Object as PropType<GrandPrix>,
            required: true,
        },
        ruleSet: {
            type: Object as PropType<RuleSet>,
            required: true,
        },
        session: {
            type: Object as PropType<RaceSession>,
            required: true,
        },
        communityMembers: {
            type: Array as PropType<Array<CommunityUser>>,
            required: true,
        },
        userPoints: {
            type: Object as PropType<Dictionary<number, UserPoints>>,
            required: true,
        },
    },
    setup() {
        const dayjs = useDayjs();
        const authStore = useAuthStore();
        const communityStore = useCommunityStore();

        const humanDateTime = dayjs.humanDateTime;
        const dateDiff = dayjs.dateDiff;
        const currentUser = authStore.loggedUser;
        const currentCommunity = communityStore.currentCommunity;
        return { currentUser, currentCommunity, dateDiff, humanDateTime };
    },
    data() {
        return {
            loaded: false,
            thereAreFinishResults: false,
            sessionResults: new Array<RaceResult>(),
            pointsByPosition: {} as Dictionary<number, Dictionary<number, number>>,
            tableData: new Array<TableType>(),

            winnersBySession: new Map<RaceSession, Array<string>>(),
            winnersOfGrandPrix: new Array<string>(),

            showAdvancedStadistics: false,
            showResults: true,
            showColorUser: true,
            showColorWinner: true,
        }
    },
    mounted() {
        grandPrixService.getResults(this.gp, this.session).then((results) => {

            this.thereAreFinishResults = results.length > 0;

            this.sessionResults = [];
            const pronosticados = cantidadPilotosPronosticados(this.ruleSet, this.session);
            for (let position = 0; position < pronosticados; ++position) {
                let driver: Driver;
                let session: RaceSession;

                if (position >= results.length) {
                    driver = {code: '---'} as Driver;
                    session = this.session;
                } else {
                    driver = results[position].driver;
                    session = results[position].raceSession;
                }

                this.sessionResults.push({position: (position + 1), driver: driver, raceSession: session});
            }
        }).then(() => {
            grandPrixService.getAllTipps(this.gp, this.session, this.currentCommunity).then((tipps) => {

                // Si ya se ha cerrado el pronóstico para esta sesión, quizás hay puntos
                if (!this.session.isBeforeClosureDate()) {
                    scoreService.getPointsByPositionInGrandPrix(this.currentCommunity, this.gp, this.session).then(points => {
                        this.pointsByPosition = points;
                    }).catch(() => {}); // Capturar el error de pronósticos antes de tiempo, ignorarlo
                }

                this.communityMembers.forEach(comUser => {
                    let rowData: TableType = {
                        user: comUser.user,
                        tipps: [],
                        score: {
                            bySession: {},
                            hitPercentageBySession: {},
                            gp: 0,
                            hitPercentageInGP: 0,
                            accumulated: 0,
                            standings: 0,
                            previousStandings: 0,
                        },
                    }

                    rowData.tipps = tipps[comUser.user.id] || []; // Pongo [] por defecto por que a veces tipps[id] es undefined??? misterios

                    // Si el usuario existe en el mapa de puntos, se añade a la tabla
                    if (this.userPoints[comUser.user.id]!!) {
                        for (let session in this.userPoints[comUser.user.id]!.pointsBySession) {
                            let points: number = this.userPoints[comUser.user.id]!.pointsBySession[session]!;

                            rowData.score.bySession[session] = points;
                            // console.log("Poniendo " + comUser.user.id + " en sesion " + session + ": " + points);
                        }
                        for (let session in this.userPoints[comUser.user.id]!.hitPercentageBySession) {
                            let hits: number = this.userPoints[comUser.user.id]!.hitPercentageBySession[session]!;

                            rowData.score.hitPercentageBySession[session] = hits;
                        }
                        rowData.score.hitPercentageInGP = this.userPoints[comUser.user.id]!.hitPercentageInGP || -1;

                        rowData.score.gp = this.userPoints[comUser.user.id]!.pointsInGP || 0;
                        rowData.score.accumulated = this.userPoints[comUser.user.id]!.accumulatedPoints || 0;

                        rowData.score.standings = this.userPoints[comUser.user.id]!.standings || Number.MAX_SAFE_INTEGER;
                        rowData.score.previousStandings = this.userPoints[comUser.user.id]!.previousStandings || 0;
                    }

                    this.tableData.push(rowData);

                });

                this.gp.sessions.forEach((ses) => {
                    this.winnersBySession.set(ses, this.findWinnerUserOfSession(ses));
                })
                this.winnersOfGrandPrix = this.findWinnerUserOfSession(undefined);

                this.loaded = true;
            });
        })
    },
    methods: {
        /**
         * Buscar el nombre del usuario con más puntos en la sesión
         */
        findWinnerUserOfSession(session?: RaceSession, minumum = -Infinity): Array<string> {
            let maxSum = minumum;

            let winners = [];
            for (let key in this.userPoints) {
                let value = this.userPoints[key]!;
                let pointsOfUser = 0;

                if (session === undefined) {
                    pointsOfUser = value.pointsInGP;
                } else {
                    pointsOfUser = value.pointsBySession[session.name] ?? 0;
                }

                if (pointsOfUser > maxSum) {
                    maxSum = pointsOfUser;
                    return this.findWinnerUserOfSession(session, maxSum);
                } else if (pointsOfUser == maxSum && pointsOfUser != 0) {
                    winners.push(value.user.username);
                }
            }
            return winners;
        },
        checkRowClass(row: any) {
            if (this.winnersOfGrandPrix.includes(row.user.username) && this.showColorWinner) return 'is-winner';
            if (row.user.username === this.currentUser.username && this.showColorUser) return 'is-user';
            return '';
        },
        /**
         * Retorna un icono de trofeo si eres el ganador de esas puntuaciones
         * @param username Nombre del usuario
         * @param session Sesión en la que consultar
         */
        checkAndInsertTrophy(username: string, session?: RaceSession) {
            if (session == undefined) {
                return (this.winnersOfGrandPrix.includes(username))
            }
            return this.winnersBySession.get(session)?.includes(username) || false;
        },
        driverTooltip(driver: Driver) {
            if (driver.code === "???") return "Pronóstico Oculto"; // Si hay pronóstico, pero este esta oculto, informar de eso
            return driver.firstname + ' ' + driver.lastname + ' (' + driver.team.name + ')';
        }
    }
});
</script>

<style lang="scss">
@import "bulma/sass/utilities/_all.sass";

tr.is-user {
    background: $primary;
    &:not(:hover) {
        color: #fff;
    }
}

tr.is-winner {
    background: $warning;
}

.has-text-purple {
    color: #9200d1 !important;
}
</style>