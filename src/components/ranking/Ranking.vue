<template>
    <div id="rankingComponent" class="box">
        <nav class="block is-flex is-justify-content-space-between">

            <PrognoPageTitle name="Ranking" />
            <b-select v-if="seasonList" v-model="chosenSeason" placeholder="Selecciona la temporada"  @input="changeSeason()" >
                <option
                    v-for="season in seasonList"
                    :value="season"
                    :key="season.id">
                    {{ season.competition.name }} {{ season.name }}
                </option>
            </b-select>
        </nav>

        <template v-if="rankingBusy">

            <b-tabs v-model="activeTab">
                <b-tab-item label="Ranking por Gran Premio">
                    <h1 class="title is-4">Ranking por Gran Premio</h1>
                    <p class="content">
                        Los ganadores de cada Gran Premio tendrán representado un <b-icon pack="fas" type="is-info" icon="trophy"></b-icon>
                    </p>
                    <b-table :data="tableData"
                             hoverable
                             mobile-cards
                             default-sort="totalScore"
                             default-sort-direction="DESC"
                             :row-class="(row, index) => checkRowClass(row, index)"
                    >

                        <b-table-column label="Pos." sortable numeric v-slot="props">
                            <span class="has-text-weight-bold">#{{ props.index + 1 }}</span>
                        </b-table-column>

                        <b-table-column field="user.username" label="Nombre" sortable>
                            <template v-slot="props">
                                <b-tooltip
                                    position="is-right"
                                    type="is-light"
                                    append-to-body>
                                    <template v-slot:content>
                                        <UserMiniCard :user="communityMembers.get(props.row.user.username)" />
                                    </template>

                                    <span class="has-text-weight-bold">{{ props.row.user.username }}</span>
                                </b-tooltip>
                            </template>
                        </b-table-column>

                        <b-table-column v-for="gp in grandPrixList()" v-bind:key="gp.code" field="pointsInGP" sortable numeric>
                            <template v-slot:header="{ column }">
                                <b-tooltip :label="gp.name">
                                    {{ gp.code }}
                                </b-tooltip>
                            </template>
                            <template v-slot="props">

                                <b-tooltip v-if="checkAndInsertTrophy(gp.name, props.row.gps.get(gp.name).pointsInGP)"
                                           :label="'Ganador de ' + gp.name"
                                           type="is-light">
                                    <b-icon pack="fas" type="is-info" icon="trophy"></b-icon>
                                </b-tooltip>

                                <PointsTooltipComponent
                                    v-if="props.row.gps.has(gp.name)"
                                    :gp-name="gp.name"
                                    :user-points="props.row.gps.get(gp.name)"
                                    :display-points="props.row.gps.get(gp.name).pointsInGP" />
                                <template v-else>
                                    0 :(
                                </template>
                            </template>
                        </b-table-column>

                        <b-table-column field="totalScore" label="Total" sortable numeric v-slot="props">
                            <span class="has-text-weight-bold">{{ props.row.totalScore }}</span>
                        </b-table-column>
                    </b-table>

                    <h1 class="title is-4 mt-4">Puntos por Gran Premio</h1>
                    <VueApexCharts
                        height="400"
                        type="line"
                        :options="chartOptions"
                        :series="chartSeries">
                    </VueApexCharts>
                </b-tab-item>
                <b-tab-item label="Ranking acumulado">
                    <h1 class="title is-4 mt-4">Ranking acumulado</h1>
                    <p class="content">
                        La puntuación marcada en <b-tag type="is-warning">dorado</b-tag> es la máxima acumulada para ese Gran Premio<br/>
                    </p>
                    <b-table :data="tableDataAcumulada"
                             hoverable
                             mobile-cards
                             default-sort="totalScore"
                             default-sort-direction="DESC"
                             :row-class="(row, index) => checkRowClass(row, index)"
                    >

                        <b-table-column label="Pos." sortable numeric v-slot="props">
                            <span class="has-text-weight-bold">#{{ props.index + 1 }}</span>
                        </b-table-column>

                        <b-table-column field="user.username" label="Nombre" sortable>
                            <template v-slot="props">
                                <b-tooltip
                                    position="is-right"
                                    type="is-light"
                                    append-to-body>
                                    <template v-slot:content>
                                        <UserMiniCard :user="communityMembers.get(props.row.user.username)" />
                                    </template>

                                    <span class="has-text-weight-bold">{{ props.row.user.username }}</span>
                                </b-tooltip>
                            </template>
                        </b-table-column>

                        <b-table-column v-for="gp in grandPrixList()" v-bind:key="gp.code"
                                        :field="gp.code"
                                        sortable numeric>
                            <template v-slot:header="{ column }">
                                <b-tooltip :label="gp.name">
                                    {{ gp.code }}
                                </b-tooltip>
                            </template>
                            <template v-slot="props">

                                <template v-if="props.row.gps.has(gp.name)">
                                    <b-tag type="is-warning" v-if="checkWinnerCell(gp.name, props.row.gps.get(gp.name).accumulatedPoints)">
                                        <PointsTooltipComponent
                                            :gp-name="gp.name"
                                            :user-points="props.row.gps.get(gp.name)"
                                            :display-points="props.row.gps.get(gp.name).accumulatedPoints" />
                                    </b-tag>
                                    <template v-else>
                                        <PointsTooltipComponent
                                            :gp-name="gp.name"
                                            :user-points="props.row.gps.get(gp.name)"
                                            :display-points="props.row.gps.get(gp.name).accumulatedPoints" />
                                    </template>
                                </template>
                                <template v-else>
                                    0 :(
                                </template>

                            </template>
                        </b-table-column>
                    </b-table>

                    <h1 class="title is-4 mt-4">Puntos acumulados</h1>
                    <VueApexCharts
                        height="400"
                        type="line"
                        :options="chartOptions"
                        :series="chartSeriesAcumuladas">
                    </VueApexCharts>
                </b-tab-item>
                <b-tab-item label="Ranking por clasificación">
                    <h1 class="title is-4 mt-4">Clasificaciones</h1>
                    <b-table :data="tableDataAcumulada"
                             hoverable
                             mobile-cards
                             default-sort="totalScore"
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
                                        <UserMiniCard :user="communityMembers.get(props.row.user.username)" />
                                    </template>

                                    <span class="has-text-weight-bold">{{ props.row.user.username }}</span>
                                </b-tooltip>
                            </template>
                        </b-table-column>

                        <b-table-column v-for="gp in grandPrixList()" v-bind:key="gp.code"
                                        :field="gp.code"
                                        sortable numeric>
                            <template v-slot:header="{ column }">
                                <b-tooltip :label="gp.name">
                                    {{ gp.code }}
                                </b-tooltip>
                            </template>
                            <template v-slot="props">

                                <!-- //ToDo: Tooltip desglosando puntos por sesiones-->
                                <template v-if="props.row.gps.has(gp.name)">
                                    <b-tag type="is-warning" v-if="props.row.gps.get(gp.name).standings === 1">
                                        {{ props.row.gps.get(gp.name).standings }}
                                    </b-tag>
                                    <template v-else>
                                        <template v-if="props.row.gps.get(gp.name).standings >= 1">
                                            {{ props.row.gps.get(gp.name).standings }}
                                        </template>
                                        <template v-else>
                                            --
                                        </template>
                                    </template>
                                </template>
                                <template v-else>
                                    :(
                                </template>

                            </template>
                        </b-table-column>
                    </b-table>

                    <VueApexCharts
                        height="400"
                        type="line"
                        :options="chartStandingsOptions"
                        :series="chartStandings">
                    </VueApexCharts>
                </b-tab-item>
                <b-tab-item label="Estadisticas de usuarios" disabled>

                </b-tab-item>
            </b-tabs>

        </template>
        <loading v-else />
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
    import {communityService, grandPrixService, scoreService, seasonService} from "@/_services";
    import {GrandPrix} from "@/types/GrandPrix";
    import {Competition} from "@/types/Competition";
    import {Season} from "@/types/Season";
    import UserMiniCard from "@/components/user/UserMiniCard.vue";
    import {User} from "@/types/User";
    import {Community} from "@/types/Community";
    import {namespace} from "vuex-class";
    import VueApexCharts from "vue-apexcharts";
    import {UserPoints} from "@/types/UserPoints";
    import PointsTooltipComponent from "@/components/ranking/PointsTooltipComponent.vue";

    interface TableEntry {
        'user': User;
        'gps': Map<string, UserPoints>;
        'totalScore': number
    }

    const Auth = namespace('Auth')
    @Component({
        components: {
            PrognoPageTitle, UserMiniCard, VueApexCharts, PointsTooltipComponent
        }
    })
    export default class Ranking extends Vue {
        @Auth.State("community") private currentCommunity!: Community;
        @Auth.State("user") private currentUser!: User;

        private activeTab: number = 0;
        private rankingBusy: boolean = true;
        private chosenSeason?: Season;
        private seasonList: Array<Season> = [];
        private gps: Array<GrandPrix> = [];
        private gpsWithPoints: Array<string> = []; // Only names

        private maxPointsInGrandPrix: Map<string, number> = new Map();
        private maxAccumulatedPointsInGrandPrix: Map<string, number> = new Map();

        private communityMembers: Map<string, User> = new Map();

        private tableData: TableEntry[] = [];
        private tableDataAcumulada: TableEntry[] = [];

        private chartSeries: any = [];
        private chartSeriesAcumuladas: any = [];
        private chartStandings: any = [];


        created() {
            seasonService.getSeasonList().then((seasons) => {
                this.seasonList = [];
                this.seasonList.push(...seasons);
            });

            this.chartOptions = {
                ...this.chartOptions,
                xaxis: {
                    categories: [...this.gps.map(gp => gp.code)],
                },
            }
            this.chartStandingsOptions = {
                ...this.chartOptions,
                yaxis: {
                    reversed: true,
                    title: {
                        text: 'Posición'
                    },
                    min: 1,
                    tickAmount: 1,
                    labels: {
                        formatter: function (val: number) {
                            return val.toFixed(0) + "º"; // Sin decimal y con símbolo de ordinario
                        }
                    }
                },
            }

            this.loadRanking(this.currentCommunity.competition, this.currentCommunity.competition.currentSeason);
        }

        private changeSeason() {
            this.loadRanking(this.chosenSeason!.competition, this.chosenSeason!);
        }

        loadRanking(competition: Competition, season: Season) {
            this.rankingBusy = true;

            this.tableData = [];
            this.tableDataAcumulada = [];

            this.chartSeries = [];
            this.chartSeriesAcumuladas = [];
            this.chartStandings = [];

            grandPrixService.getGrandPrixesList(competition, season, 'all').then(gps => {
                this.gps = gps;
                this.checkRankingLoaded();
            });

            communityService.getMembers(this.currentCommunity).then((members) => {
                this.communityMembers = new Map<string, User>();
                members.forEach(miembro => {
                    this.communityMembers.set(miembro.user.username, miembro.user);
                });
            }).then(() => {
                scoreService.getUserPointsByGP(this.currentCommunity, competition, season).then(grandPrixPoints => {

                    let entradas: Map<string, TableEntry> = new Map();
                    let entradasAcumuladas: Map<string, TableEntry> = new Map();
                    this.communityMembers.forEach((member) => {
                        entradas.set(member!.username, {
                            gps: new Map(),
                            totalScore: 0,
                            user: member!
                        });
                        entradasAcumuladas.set(member!.username, {
                            gps: new Map(),
                            totalScore: 0,
                            user: member!
                        });
                    });

                    // Para cada gran premio
                    Object.entries(grandPrixPoints).forEach(([gp, entry]) => {
                        this.gpsWithPoints.push(gp);
                        this.maxPointsInGrandPrix.set(gp, -Infinity);
                        this.maxAccumulatedPointsInGrandPrix.set(gp, -Infinity);

                        // Cada usuario en cada gran premio
                        for (let [slot, userPoints] of Object.entries(entry!)) {
                            let user = userPoints!.user!.username;
                            // asigno entradas a los usuarios existentes, con sus resultados en el gp iterado
                            if (user !== undefined && (entradas.has(user) || entradasAcumuladas.has(user))) {

                                entradas.get(user)!.gps.set(gp, userPoints!);
                                entradasAcumuladas.get(user)!.gps.set(gp, userPoints!);

                                if (userPoints!.pointsInGP! > this.maxPointsInGrandPrix.get(gp)!) {
                                    this.maxPointsInGrandPrix.set(gp, userPoints!.pointsInGP!);
                                }
                                if (userPoints!.accumulatedPoints > this.maxAccumulatedPointsInGrandPrix.get(gp)!) {
                                    this.maxAccumulatedPointsInGrandPrix.set(gp, userPoints!.accumulatedPoints!);
                                }
                            }
                        }
                    });

                    scoreService.getTotalUserPoints(this.currentCommunity, competition, season).then(points => {
                        Object.entries(points).forEach(([username, totalScore]) => {

                            // Agrego a tablas y gráficas sólo si ha recibido alguna puntuación en la temporada
                            if (totalScore != 0) {

                                entradas.get(username)!.totalScore = totalScore || 0;

                                // Utilizo el mismo for de iterar usuarios para guardar las filas
                                // Guardo las entradas creadas en las filas de la tabla
                                this.tableData.push(entradas.get(username)!);
                                this.tableDataAcumulada.push(entradasAcumuladas.get(username)!);


                                let chartData = [];
                                let accumulatedChartData = [];
                                let standingsChartData = [];
                                for (let uPoints of entradas.get(username)!.gps.values()) {
                                    chartData.push(uPoints.pointsInGP);

                                    // Null para no mostrar si no existe una standing, por ejemplo, no tiene resultados las primeras carreras
                                    let standing = (uPoints.standings > 0) ? uPoints.standings : null;
                                    standingsChartData.push(standing);
                                }
                                for (let uPoints of entradasAcumuladas.get(username)!.gps.values()) {
                                    accumulatedChartData.push(uPoints.accumulatedPoints);
                                }
                                // Agrego a la gráfica de puntos
                                this.chartSeries = [
                                    ...this.chartSeries,
                                    {
                                        name: username,
                                        data: chartData,
                                    },
                                ]
                                this.chartSeriesAcumuladas = [
                                    ...this.chartSeriesAcumuladas,
                                    {
                                        name: username,
                                        data: accumulatedChartData,
                                    },
                                ]
                                this.chartStandings = [
                                    ...this.chartStandings,
                                    {
                                        name: username,
                                        data: standingsChartData,
                                    },
                                ]
                            }

                        });
                    }).then(() => {
                        this.checkRankingLoaded();
                    });

                });
            });

        }

        public checkRankingLoaded() {
            this.rankingBusy = (this.gps.length !== 0 && this.tableData.length !== 0);
        }

        private checkRowClass(row: any, index: number) {
            if (row.user.username === this.currentUser.username) return 'is-user';
            return '';
        }

        public grandPrixList(): Array<GrandPrix> {
            return this.gps.filter((gp => this.gpsWithPoints.includes(gp.name)));
        }

        private checkAndInsertTrophy(gp: string, score: number) {
            return (this.maxPointsInGrandPrix.get(gp)! == score);
        }

        private checkWinnerCell(gp: string, score: number) {
            return (this.maxAccumulatedPointsInGrandPrix.get(gp)! == score);
        }

        private chartOptions: any = {
            chart: {
                shadow: {
                    enabled: true,
                    color: '#000',
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 1
                },
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: true,
            },
            stroke: {
                curve: 'smooth',
                width: 3
            },
            markers: {
                size: 5
            },
            xaxis: {
                title: {
                    text: 'Grandes Premios'
                }
            },
            yaxis: {
                title: {
                    text: 'Puntos'
                }
            },
            legend: {
                position: 'top',
                floating: true,
            },
            tooltip: {
                x: {
                    formatter: (codePos: number) => { return [...this.grandPrixList().values()][codePos - 1].name },
                }
            },
        };

        private chartStandingsOptions: any = {};
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
</style>
