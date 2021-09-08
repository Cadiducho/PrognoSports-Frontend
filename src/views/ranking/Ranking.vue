<template>
    <div id="rankingComponent" class="box">
        <PrognoPageTitle name="Ranking" />

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

                        <b-table-column v-for="gp in grandPrixList()" v-bind:key="gp.code" :field="gp.code" sortable numeric>
                            <template v-slot:header="{ column }">
                                <b-tooltip :label="gp.name">
                                    {{ gp.code }}
                                </b-tooltip>
                            </template>
                            <template v-slot="props">

                                <b-tooltip v-if="checkAndInsertTrophy(gp.name, props.row.gps.get(gp.name))"
                                           :label="'Ganador de ' + gp.name"
                                           type="is-light">
                                    <b-icon pack="fas" type="is-info" icon="trophy"></b-icon>
                                </b-tooltip>

                                <!-- //ToDo: Tooltip desglosando puntos por sesiones-->
                                {{ props.row.gps.get(gp.name) || 0 }}
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

                                <!-- //ToDo: Tooltip desglosando puntos por sesiones-->
                                <b-tag type="is-warning" v-if="checkWinnerCell(gp.name, props.row.gps.get(gp.name))">{{ props.row.gps.get(gp.name) }}</b-tag>
                                <template v-else>
                                    {{ props.row.gps.get(gp.name) || 0 }}
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
                <b-tab-item label="Ranking por clasificación" disabled>

                </b-tab-item>
            </b-tabs>



        </template>
        <template v-else><loading /></template>

    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
    import {communityService, grandPrixService, scoreService} from "@/_services";
    import {GrandPrix} from "@/types/GrandPrix";
    import {Competition} from "@/types/Competition";
    import {Season} from "@/types/Season";
    import UserMiniCard from "@/components/user/UserMiniCard.vue";
    import {User} from "@/types/User";
    import {Community} from "@/types/Community";
    import {namespace} from "vuex-class";
    import {Dictionary} from "@/types/Dictionary";
    import VueApexCharts from "vue-apexcharts";

    interface TableEntry {
        'user': User;
        'gps': Map<string, number>; //ToDo: no number, any o algo para poner los puntos por cada sesión
        'totalScore': number
    }

    const Auth = namespace('Auth')
    @Component({
        components: {
            PrognoPageTitle, UserMiniCard, VueApexCharts
        }
    })
    export default class Ranking extends Vue {
        @Auth.State("community") private currentCommunity!: Community;
        @Auth.State("user") private currentUser!: User;

        private activeTab: number = 0;
        private rankingBusy: boolean = true;
        private gps: Array<GrandPrix> = [];
        private gpsWithPoints: Array<string> = []; // Only names

        private maxPointsInGrandPrix: Map<string, number> = new Map();
        private maxAccumulatedPointsInGrandPrix: Map<string, number> = new Map();

        private communityMembers: Map<string, User> = new Map();

        private tableData: TableEntry[] = [];
        private tableDataAcumulada: TableEntry[] = [];

        private chartSeries: any = [];
        private chartSeriesAcumuladas: any = [];

        created() {
            // FixMe: Temporadas y competición de verdad, como en /gps
            let competition = { id: 1} as Competition;
            let season = { id: 4} as Season;

            grandPrixService.getGrandPrixesList('all', competition, season).then(gps => {
                this.gps = gps;
                this.checkRankingLoaded();

                this.chartOptions = {
                    ...this.chartOptions,
                    xaxis: {
                        categories: [...this.gps.map(gp => gp.code)],
                    }
                }
            });

            communityService.getMembers(this.currentCommunity).then((members) => {
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
                        // @ts-ignore
                        Object.entries(entry).forEach(([user, point]) => {
                            // asigno entradas a los usuarios existentes, con sus resultados en el gp iterado
                            if (user !== undefined && (entradas.has(user) || entradasAcumuladas.has(user))) {

                                entradas.get(user)!.gps.set(gp, point || 0);

                                let puntosAnteriores: Array<number> = [0, ...entradasAcumuladas.get(user)!.gps.values()];
                                let puntosAcumulados: number = point! + puntosAnteriores[puntosAnteriores.length-1] + 1;
                                entradasAcumuladas.get(user)!.gps.set(gp, puntosAcumulados);

                                if (point! > this.maxPointsInGrandPrix.get(gp)!) {
                                    this.maxPointsInGrandPrix.set(gp, point!);
                                }
                                if (puntosAcumulados > this.maxAccumulatedPointsInGrandPrix.get(gp)!) {
                                    this.maxAccumulatedPointsInGrandPrix.set(gp, puntosAcumulados);
                                }
                            }
                        });
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


                                // Agrego a la gráfica de puntos
                                this.chartSeries = [
                                    ...this.chartSeries,
                                    {
                                        name: username,
                                        data: [...entradas.get(username)!.gps.values()],
                                    },
                                ]
                                this.chartSeriesAcumuladas = [
                                    ...this.chartSeriesAcumuladas,
                                    {
                                        name: username,
                                        data: [...entradasAcumuladas.get(username)!.gps.values()],
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
