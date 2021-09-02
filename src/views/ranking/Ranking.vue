<template>
    <div id="rankingComponent" class="box">
        <PrognoPageTitle name="Ranking" />

        <h1 class="title is-5">Ranking individual</h1>
        <template v-if="individualRankingBusy">
            <!--<section>
                <b-field grouped group-multiline>
                    <div class="control">
                        // Esto no se puede hacer como es deseado porque BTable no tiene :columns reactivo. Se añaden colummnas, pero al desactivar el slider no se eliminan,.
                        <b-switch v-model="showEmptyGrandPrixes" @click="reloadTable()">Mostrar GPs sin puntuación</b-switch>
                    </div>
                </b-field>
            </section>-->
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
                                <UserMiniCard :user="communityMembers[props.row.user.username]" />
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

                        <b-tooltip v-if="checkAndInsertTrophy(gp.name, props.row.gps[gp.name])"
                                   :label="'Ganador de ' + gp.name"
                                   type="is-light">
                            <b-icon pack="fas" type="is-info" icon="trophy"></b-icon>
                        </b-tooltip>

                        <!-- //ToDo: Tooltip desglosando puntos por sesiones-->
                        {{ props.row.gps[gp.name] || 0 }}
                    </template>
                </b-table-column>

                <b-table-column field="totalScore" label="Total" sortable numeric v-slot="props">
                    <span class="has-text-weight-bold">{{ props.row.totalScore }}</span>
                </b-table-column>
            </b-table>

        </template>
        <template v-else><loading /></template>

        <h1 class="title is-5">Puntos por Gran Premio</h1>
        <VueApexCharts
                       height="400"
                       type="line"
                       :options="chartOptions"
                       :series="chartSeries">
        </VueApexCharts>
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
        'gps': Dictionary<string, number>; //ToDo: no number, any o algo para poner los puntos por cada sesión
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

        private individualRankingBusy: boolean = true;
        private showEmptyGrandPrixes = false;
        private gps: Array<GrandPrix> = [];
        private gpsWithPoints: Array<string> = []; // Only names
        private pointsByGrandPrix: Dictionary<string, Dictionary<string, number>> = {};
        private maxPointsInGrandPrix: Map<string, number> = new Map();

        private communityMembers: Dictionary<string, User> = {};

        private tableData: TableEntry[] = [];
        private chartSeries: any = [];
            private breadcumbItems = [
            {
                text: 'Inicio',
                to: '/home'
            },
            {
                text: 'Ranking',
                active: true
            }
        ];

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
                    this.communityMembers[miembro.user.username] = miembro.user;
                });
            }).then(() => {
                scoreService.getUserPointsByGP(this.currentCommunity, competition, season).then(grandPrixPoints => {
                    this.pointsByGrandPrix = grandPrixPoints;

                    let entradas: Dictionary<string, TableEntry> = {};
                    let tableEntry: TableEntry;
                    Object.values(this.communityMembers).forEach((member) => {
                        tableEntry = {
                            gps: {},
                            totalScore: 0,
                            user: member!
                        };
                        entradas[member!.username] = tableEntry;
                    });

                    // Para cada gran premio
                    Object.entries(grandPrixPoints).forEach(([gp, entry]) => {
                        this.gpsWithPoints.push(gp);
                        this.maxPointsInGrandPrix.set(gp, -Infinity);

                        let puntosGraficaGranPremio = [];
                        // Cada usuario en cada gran premio
                        // @ts-ignore
                        Object.entries(entry).forEach(([user, point]) => {
                            // asigno entradas a los usuarios existentes, con sus resultados en el gp iterado
                            if (user !== undefined && entradas[user]!!) {
                                // @ts-ignore
                                entradas[user].gps[gp] = point;
                                if (point! > this.maxPointsInGrandPrix.get(gp)!) {
                                    this.maxPointsInGrandPrix.set(gp, point!);
                                }
                            }
                        });
                    });

                    scoreService.getTotalUserPoints(this.currentCommunity, competition, season).then(points => {
                        Object.entries(points).forEach(([username, totalScore]) => {
                            // @ts-ignore

                            // Agrego a tablas y gráficas sólo si ha recibido alguna puntuación en la temporada
                            if (totalScore != 0) {
                                entradas[username].totalScore = totalScore || 0;

                                // Utilizo el mismo for de iterar usuarios para guardar las filas
                                // Guardo las entradas creadas en las filas de la tabla
                                this.tableData.push(entradas[username]!);


                                // Agrego a la gráfica de puntos
                                this.chartSeries = [
                                    ...this.chartSeries,
                                    {
                                        name: username,
                                        data: Object.values(entradas[username].gps),
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
            this.individualRankingBusy = (this.gps.length !== 0 && this.tableData.length !== 0);
        }

        private checkRowClass(row: any, index: number) {
            if (row.user.username === this.currentUser.username) return 'is-user';
            return '';
        }

        public grandPrixList(): Array<GrandPrix> {
            if (!this.showEmptyGrandPrixes) return this.gps.filter((gp => this.gpsWithPoints.includes(gp.name)));

            return this.gps;
        }

        private checkAndInsertTrophy(gp: string, score: number) {
            return (this.maxPointsInGrandPrix.get(gp)! == score);
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
