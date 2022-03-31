<template>
    <div>
        <loading v-if="!loaded" />
        <template v-else>
            <span class="title is-5">Puntuaciones de {{ sessionName }} </span> <br/>
            <span class="title is-6">Leyenda</span>
            <p class="content">
                Tus puntuaciones salen reflejadas con color <b-tag type="is-primary">verde</b-tag> <br/>
                El ganador del Gran Premio es reflejado con color <b-tag type="is-warning">dorado</b-tag> <br/>
                Los ganadores de cada sesión tendrán representado un <b-icon pack="fas" icon="trophy"></b-icon>
            </p>

            <b-notification v-if="currentUser.preferences['hide-tipps-until-start'] === true" type="is-info is-light" aria-close-label="Close notification">
                Tus pronósticos están ocultos al resto de usuarios hasta {{ (this.session === "RACE" ? gp.raceTime : gp.qualiTime) | humanDateTimeMinusFiveMinutes}}
            </b-notification>
            <b-notification v-if="!thereAreFinishResults" type="is-info is-light" aria-close-label="Close notification">
                Aún no hay resultados confirmados para esta sesión
            </b-notification>

            <b-table :data="tableData"
                     hoverable
                     mobile-cards
                     default-sort="score.accumulated"
                     default-sort-direction="DESC"
                     :row-class="(row, index) => checkRowClass(row, index)"
            >

                <b-table-column field="score.standings" label="Pos." width="80" sortable numeric>
                    <template v-slot="props">
                        <!-- Compruebo si ya tiene un nuevo ranking para este GP. En caso de tenerlo, lo comparo con el anterior y añado una flecha de cambio si es necesario -->
                        <!-- Mostrar ranking, si lo tiene (menor que Number.MAX_SAFE_INTEGER) -->
                        <span v-if="props.row.score.standings < Number.MAX_SAFE_INTEGER">


                            <template v-if="props.row.score.standings > 0">
                                <!-- Solo puedo añadir flechas si existe un previous -->
                                <template v-if="props.row.score.previousStandings > 0">
                                    <b-tooltip v-if="props.row.score.previousStandings > props.row.score.standings"
                                               :label="'Asciende de ' + props.row.score.previousStandings + 'º a ' + props.row.score.standings + 'º'"
                                               type="is-success is-small">
                                        <b-icon pack="fas" type="is-success" icon="arrow-up"></b-icon>
                                    </b-tooltip>
                                    <b-tooltip v-if="props.row.score.previousStandings < props.row.score.standings"
                                               :label="'Desciende de ' + props.row.score.previousStandings + 'º a ' + props.row.score.standings + 'º'"
                                               type="is-danger is-small">
                                        <b-icon pack="fas" type="is-danger" icon="arrow-down"></b-icon>
                                    </b-tooltip>
                                </template>

                                {{ props.row.score.standings }}º

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
                </b-table-column>

                <b-table-column field="user.username" label="Nombre" sortable>
                    <template v-slot="props">
                        <b-tooltip
                            position="is-right"
                            type="is-light"
                            append-to-body>
                            <template v-slot:content>
                                <!-- User mini card -->
                                <UserMiniCard :user="props.row.user" />
                            </template>

                            <span class="has-text-weight-bold">{{ props.row.user.username }}</span>
                        </b-tooltip>
                    </template>
                </b-table-column>

                <b-table-column v-for="(position, index) in sessionResults" v-bind:key="position.position" :field="position.driver.code">
                    <template v-slot:header="{ column }">
                        <b-tooltip v-if="position.driver.code !== '---'"
                                   :label="driverTooltip(position.driver)"
                                   append-to-body>
                            {{ index + 1 }}. {{ position.driver.code }}
                        </b-tooltip>
                        <template v-else>
                            {{ index + 1 }}. ---
                        </template>
                    </template>
                    <template v-slot="props">

                        <b-tooltip
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
                        </b-tooltip>

                        <!-- Si no hay pronóstico para este usuario y posición, se coloca un "---" -->
                        <template v-else>
                            ---
                        </template>
                    </template>
                </b-table-column>

                <b-table-column field="score.qualify" label="Q" sortable numeric v-slot="props">
                    <b-tooltip v-if="checkAndInsertTrophy(props.row.user.username, 1)"
                               label="Ganador de la sesión de clasificación"
                               type="is-light">
                        <b-icon pack="fas" type="is-info" icon="trophy"></b-icon>
                    </b-tooltip>
                    {{ props.row.score.qualify }}
                </b-table-column>

                <b-table-column field="score.race" label="R" sortable numeric v-slot="props">
                    <b-tooltip v-if="checkAndInsertTrophy(props.row.user.username, 2)"
                                label="Ganador de la sesión de carrera"
                               type="is-light">
                        <b-icon pack="fas" type="is-success" icon="trophy"></b-icon>
                    </b-tooltip>

                    <span v-bind:class="{'has-text-danger': props.row.score.race < 0}">
                        {{ props.row.score.race }}
                    </span>

                </b-table-column>

                <b-table-column field="score.gp" label="GP" sortable numeric v-slot="props">
                    <b-tooltip v-if="checkAndInsertTrophy(props.row.user.username, 3)"
                               label="Ganador del Gran Premio"
                               type="is-light">
                        <b-icon pack="fas" type="is-purple" icon="trophy"></b-icon>
                    </b-tooltip>
                    {{ props.row.score.gp }}
                </b-table-column>
                <b-table-column field="score.accumulated" label="TOT" sortable numeric v-slot="props">
                    <span class="has-text-weight-bold">{{ props.row.score.accumulated }}</span>
                </b-table-column>
            </b-table>
        </template>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {User} from "@/types/User";
import {namespace} from "vuex-class";
import {RaceSession} from "@/types/RaceSession";
import {grandPrixService, scoreService} from "@/_services";
import {GrandPrix} from "@/types/GrandPrix";
import {RaceResult} from "@/types/RaceResult";
import {Community} from "@/types/Community";
import {Driver} from "@/types/Driver";
import {CommunityUser} from "@/types/CommunityUser";
import UserMiniCard from "@/components/user/UserMiniCard.vue";
import {cantidadPilotosPronosticados, isBeforeEndDate} from "@/utils";
import {UserPoints} from "@/types/UserPoints";
import {Dictionary} from "@/types/Dictionary";
import EventBus from "@/plugins/eventbus";

const Auth = namespace('Auth')

interface TableType {
    user: User;
    tipps: Array<RaceResult>;
    score: {
        qualify: number,
        race: number,
        gp: number,
        accumulated: number,
        standings: number,
        previousStandings: number
    }
}

@Component({
    components: {UserMiniCard}
})
export default class ScoreComponents extends Vue {
    @Prop({required: true}) gp!: GrandPrix;
    @Prop({required: true}) session!: RaceSession;
    @Prop({required: true}) userPoints!: Dictionary<number, UserPoints>;
    @Auth.State("user") private currentUser!: User;
    @Auth.State("community") private currentCommunity!: Community;

    private loaded = false;
    private thereAreFinishResults = false;
    private sessionResults: Array<RaceResult> = [];
    private communityMembers: Array<CommunityUser> = [];
    private pointsByPosition: Dictionary<number, Dictionary<number, number>> = {};
    private tableData: TableType[] = [];

    private winnersOfQualify: Array<string> = [];
    private winnersOfRace: Array<string> = [];
    private winnersOfGrandPrix: Array<string> = [];

    mounted() {
        EventBus.$on('sendCommunityMembers', (members: Array<CommunityUser>) => {
            this.communityMembers.push(...members);
        });

        grandPrixService.getResults(this.gp, this.session).then((results) => {

            this.thereAreFinishResults = results.length > 0;

            this.sessionResults = [];
            for (let position = 0; position < cantidadPilotosPronosticados(this.currentCommunity, this.session); ++position) {
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
                if (!isBeforeEndDate(this.gp, this.session)) {
                    scoreService.getPointsByPositionInGrandPrix(this.currentCommunity, this.gp, this.session).then(points => {
                        this.pointsByPosition = points;
                    }).catch(() => {}); // Capturar el error de pronósticos antes de tiempo, ignorarlo
                }

                this.communityMembers.forEach(comUser => {
                    let rowData: TableType = {
                        user: comUser.user,
                        tipps: [],
                        score: {
                            qualify: 0,
                            race: 0,
                            gp: 0,
                            accumulated: 0,
                            standings: 0,
                            previousStandings: 0,
                        },
                    }

                    rowData.tipps = tipps[comUser.user.id] || []; // Pongo [] por defecto por que a veces tipps[id] es undefined??? misterios

                    if (this.userPoints[comUser.user.id]!!) {
                        if (this.userPoints[comUser.user.id]!.pointsInQualify!!) {
                            rowData.score.qualify = this.userPoints[comUser.user.id]!.pointsInQualify;
                        }
                        if (this.userPoints[comUser.user.id]!.pointsInRace!!) {
                            rowData.score.race = this.userPoints[comUser.user.id]!.pointsInRace;
                        }

                        rowData.score.gp = this.userPoints[comUser.user.id]!.pointsInGP || 0;
                        rowData.score.accumulated = this.userPoints[comUser.user.id]!.accumulatedPoints || 0;

                        rowData.score.standings = this.userPoints[comUser.user.id]!.standings || Number.MAX_SAFE_INTEGER;
                        rowData.score.previousStandings = this.userPoints[comUser.user.id]!.previousStandings || 0;
                    }

                    this.tableData.push(rowData);

                });

                this.winnersOfQualify = this.findWinnerUserOfSession(RaceSession.QUALIFY);
                this.winnersOfRace = this.findWinnerUserOfSession(RaceSession.RACE);
                this.winnersOfGrandPrix = this.findWinnerUserOfSession(undefined);

                this.loaded = true;
            });
        })
    }

    /**
     * Buscar el nombre del usuario con más puntos en la sesión
     */
    private findWinnerUserOfSession(session?: RaceSession, minumum = -Infinity): Array<string> {
        let maxSum = minumum;

        let winners = [];
        for (let key in this.userPoints) {
            let value = this.userPoints[key]!;
            let pointsOfUser = 0;

            if (session === undefined) {
                pointsOfUser = value.pointsInGP;
            } else if (session == "RACE") {
                pointsOfUser = value.pointsInRace;
            } else {
                pointsOfUser = value.pointsInQualify;
            }

            if (pointsOfUser > maxSum) {
                maxSum = pointsOfUser;
                return this.findWinnerUserOfSession(session, maxSum);
            } else if (pointsOfUser == maxSum && pointsOfUser != 0) {
                winners.push(value.user.username);
            }
        }
        return winners;
    }

    private checkRowClass(row: any, index: number) {
        if (this.winnersOfGrandPrix.includes(row.user.username)) return 'is-winner';
        if (row.user.username === this.currentUser.username) return 'is-user';
        return '';
    }

    /**
     * Retorna un icono de trofeo si eres el ganador de esas puntuaciones
     * @param name
     * @param type
     */
    private checkAndInsertTrophy(name: string, type: number) {
        switch (type) {
            case 1: return (this.winnersOfQualify.includes(name))
            case 2: return (this.winnersOfRace.includes(name))
            case 3: return (this.winnersOfGrandPrix.includes(name))
        }
        return false;
    }

    private driverTooltip(driver: Driver) {
        if (driver.code === "???") return "Pronóstico Oculto"; // Si hay pronóstico, pero este esta oculto, informar de eso
        return driver.firstname + ' ' + driver.lastname + ' (' + driver.team.name + ')';
    }

    get sessionName() {
        return this.session == "RACE" ? "Carrera" : "Clasificación";
    }
}
</script>

<style lang="scss">
@import "~bulma/sass/utilities/_all";

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