<template>
    <div>
        <loading v-if="!loaded" />
        <template v-else>
            <span class="title is-5">Puntuaciones de {{ sessionName }} </span> <br/>
            <span class="title is-6">Leyenda</span>
            <p class="content">
                Tus puntuaciones salen reflejadas con color <b-tag type="is-primary">verde</b-tag> <br/>
                El ganador del es reflejado con color <b-tag type="is-warning">dorado</b-tag> <br/>
            </p>

            <b-notification v-if="currentUser.preferences['hide-tipps-until-start'] === true" type="is-info is-light" aria-close-label="Close notification">
                Tus pronósticos están ocultos al resto de usuarios hasta {{ (this.session === "RACE" ? gp.raceTime : gp.qualiTime) | humanDateMinusFiveMinutes}}
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

                        <!-- ToDo: Mostrar en un subtexto la puntuación obtenida por ese piloto y posición pronosticado -->
                        <b-tooltip
                            v-if="props.row.tipps[index] !== undefined"
                            :label="driverTooltip(props.row.tipps[index].driver)"
                            append-to-body>
                            {{ props.row.tipps[index].driver.code }}
                        </b-tooltip>

                        <!-- Si no hay pronóstico para este usuario y posición, se coloca un "---" -->
                        <template v-else>
                            ---
                        </template>
                    </template>
                </b-table-column>

                <b-table-column field="score.session" label="SES" sortable numeric v-slot="props">
                    {{ props.row.score.session }}
                </b-table-column>
                <b-table-column field="score.gp" label="GP" sortable numeric v-slot="props">
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
import {grandPrixService} from "@/_services";
import {GrandPrix} from "@/types/GrandPrix";
import {RaceResult} from "@/types/RaceResult";
import {Community} from "@/types/Community";
import {Driver} from "@/types/Driver";
import {CommunityUser} from "@/types/CommunityUser";
import UserMiniCard from "@/components/user/UserMiniCard.vue";
import {cantidadPilotosPronosticados} from "@/utils";
import {UserPoints} from "@/types/UserPoints";
import {Dictionary} from "@/types/Dictionary";
import EventBus from "@/plugins/eventbus";
const Auth = namespace('Auth')

interface TableType {
    'user': User;
    'tipps': Array<RaceResult>;
    'score': {'session': number, 'gp': number, 'accumulated': number}
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
    private tableData: TableType[] = [];

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
                this.communityMembers.forEach(comUser => {
                    let rowData: TableType = {
                        'user': comUser.user,
                        'tipps': [],
                        'score': {
                            'session': 0,
                            'gp': 0,
                            'accumulated': 0,
                        },
                    }

                    rowData.tipps = tipps[comUser.user.id] || []; // Pongo [] por defecto por que a veces tipps[id] es undefined??? misterios

                    if (this.userPoints[comUser.user.id]!!) {
                        if (this.session == "RACE") {
                            if (this.userPoints[comUser.user.id]!.pointsInRace!!) {
                                rowData.score.session = this.userPoints[comUser.user.id]!.pointsInRace;
                            }
                        } else {
                            if (this.userPoints[comUser.user.id]!.pointsInQualify!!) {
                                rowData.score.session = this.userPoints[comUser.user.id]!.pointsInQualify;
                            }
                        }

                        rowData.score.gp = this.userPoints[comUser.user.id]!.pointsInGP || 0;
                        rowData.score.accumulated = this.userPoints[comUser.user.id]!.accumulatedPoints || 0;
                    }

                    this.tableData.push(rowData);
                    this.loaded = true;
                });
            });
        })
    }

    get winnerUser() {
        let maxSum = 0;
        let winner = "";
        for (let key in this.userPoints) {
            let value = this.userPoints[key]!;
            if (value.pointsInGP > maxSum) {
                maxSum = value.pointsInGP;
                winner = value.user.username;
            }
        }
        return winner;
    }

    private checkRowClass(row: any, index: number) {
        if (row.user.username === this.winnerUser) return 'is-winner';
        if (row.user.username === this.currentUser.username) return 'is-user';
        return '';
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
</style>