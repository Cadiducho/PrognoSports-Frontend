<template>
    <div id="rankingComponent" class="box">
        <nav class="block is-flex is-justify-content-space-between">

            <PrognoPageTitle name="Ranking" />
            <o-field label="Temporada" :label-position="'on-border'">
                <o-select v-if="Object.keys(chosenSeason).length" v-model="chosenSeason" placeholder="Selecciona la temporada" @change="changeSeason()" >
                    <option
                        v-for="season in seasonList"
                        :value="season"
                        :key="season.id">
                        {{ season.competition.name }} {{ season.name }}
                    </option>
                </o-select>
            </o-field>
        </nav>

        <template v-if="!isLoading">

            <o-notification v-if="!tableHasData" variant="warning">
                No hay datos de esta temporada
            </o-notification>

            <o-tabs v-else v-model="activeTab">
                <o-tab-item label="Ranking por Gran Premio" :value="0">
                    <h1 class="title is-4">Ranking por Gran Premio</h1>
                    <p class="content">
                        Los ganadores de cada Gran Premio tendrán representado un <o-icon pack="fas" variant="info" icon="trophy"></o-icon>
                    </p>
                    <o-table :data="tableData"
                             hoverable
                             :mobile-cards="false"
                             default-sort="totalScore"
                             default-sort-direction="DESC"
                             :row-class="(row, index) => checkRowClass(row, index)"
                    >

                        <o-table-column label="Pos." sortable numeric v-slot="props">
                            <span class="has-text-weight-bold">#{{ props.index + 1 }}</span>
                        </o-table-column>

                        <o-table-column field="user.username" label="Nombre" sortable>
                            <template v-slot="props">
                                <o-tooltip
                                    position="right"
                                    variant="light"
                                    append-to-body>
                                    <template v-slot:content>
                                        <UserMiniCard :user="communityMembers.get(props.row.user.username)" />
                                    </template>

                                    <span class="has-text-weight-bold">{{ props.row.user.username }}</span>
                                </o-tooltip>
                            </template>
                        </o-table-column>

                        <o-table-column v-for="gp in grandPrixList()" v-bind:key="gp.code" field="pointsInGP" sortable numeric>
                            <template v-slot:header="{ column }">
                                <o-tooltip :label="gp.name">
                                    {{ gp.code }}
                                </o-tooltip>
                            </template>
                            <template v-slot="props">

                                <PointsTooltipComponent
                                    v-if="props.row.gps.has(gp.name)"
                                    :gp-name="gp.name"
                                    :user-points="props.row.gps.get(gp.name)"
                                    :display-points="props.row.gps.get(gp.name).pointsInGP" />
                                <template v-else>
                                    0 :(
                                </template>

                                <o-tooltip v-if="props.row.gps.get(gp.name)?.pointsInGP && checkAndInsertTrophy(gp.name, props.row.gps.get(gp.name).pointsInGP)"
                                           :label="'Ganador de ' + gp.name"
                                           variant="light">
                                    <o-icon pack="fas" variant="info" icon="trophy"></o-icon>
                                </o-tooltip>

                            </template>
                        </o-table-column>

                        <o-table-column field="totalScore" label="Total" sortable numeric v-slot="props">
                            <span class="has-text-weight-bold">{{ props.row.totalScore }}</span>
                        </o-table-column>
                    </o-table>

                    <h1 class="title is-4 mt-4">Puntos por Gran Premio</h1>
                    <VueApexCharts
                        height="400"
                        type="line"
                        :options="chartOptions"
                        :series="chartSeries">
                    </VueApexCharts>
                </o-tab-item>
                <o-tab-item label="Ranking acumulado" :value="1">
                    <h1 class="title is-4 mt-4">Ranking acumulado</h1>
                    <p class="content">
                        La puntuación marcada en <span class="tag is-warning">dorado</span> es la máxima acumulada para ese Gran Premio<br/>
                    </p>
                    <o-table :data="tableDataAcumulada"
                             hoverable
                             :mobile-cards="false"
                             default-sort="totalScore"
                             default-sort-direction="DESC"
                             :row-class="(row, index) => checkRowClass(row, index)"
                    >

                        <o-table-column label="Pos." sortable numeric v-slot="props">
                            <span class="has-text-weight-bold">#{{ props.index + 1 }}</span>
                        </o-table-column>

                        <o-table-column field="user.username" label="Nombre" sortable>
                            <template v-slot="props">
                                <o-tooltip
                                    position="right"
                                    variant="light"
                                    append-to-body>
                                    <template v-slot:content>
                                        <UserMiniCard :user="communityMembers.get(props.row.user.username)" />
                                    </template>

                                    <span class="has-text-weight-bold">{{ props.row.user.username }}</span>
                                </o-tooltip>
                            </template>
                        </o-table-column>

                        <o-table-column v-for="gp in grandPrixList()" v-bind:key="gp.code"
                                        :field="gp.code"
                                        sortable numeric>
                            <template v-slot:header="{ column }">
                                <o-tooltip :label="gp.name">
                                    {{ gp.code }}
                                </o-tooltip>
                            </template>
                            <template v-slot="props">

                                <template v-if="props.row.gps.has(gp.name)">
                                    <span class="tag is-warning" v-if="checkWinnerCell(gp.name, props.row.gps.get(gp.name).accumulatedPoints)">
                                        <PointsTooltipComponent
                                            :gp-name="gp.name"
                                            :user-points="props.row.gps.get(gp.name)"
                                            :display-points="props.row.gps.get(gp.name).accumulatedPoints" />
                                    </span>
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
                        </o-table-column>
                    </o-table>

                    <h1 class="title is-4 mt-4">Puntos acumulados</h1>
                    <VueApexCharts
                        height="400"
                        type="line"
                        :options="chartOptions"
                        :series="chartSeriesAcumuladas">
                    </VueApexCharts>
                </o-tab-item>
                <o-tab-item label="Ranking por clasificación" :value="2">
                    <h1 class="title is-4 mt-4">Clasificaciones</h1>
                    <o-table :data="tableDataAcumulada"
                             hoverable
                             :mobile-cards="false"
                             default-sort="totalScore"
                             default-sort-direction="DESC"
                             :row-class="(row, index) => checkRowClass(row, index)"
                    >

                        <o-table-column field="user.username" label="Nombre" sortable>
                            <template v-slot="props">
                                <o-tooltip
                                    position="right"
                                    variant="light"
                                    append-to-body>
                                    <template v-slot:content>
                                        <UserMiniCard :user="communityMembers.get(props.row.user.username)" />
                                    </template>

                                    <span class="has-text-weight-bold">{{ props.row.user.username }}</span>
                                </o-tooltip>
                            </template>
                        </o-table-column>

                        <o-table-column v-for="gp in grandPrixList()" v-bind:key="gp.code"
                                        :field="gp.code"
                                        sortable numeric>
                            <template v-slot:header="{ column }">
                                <o-tooltip :label="gp.name">
                                    {{ gp.code }}
                                </o-tooltip>
                            </template>
                            <template v-slot="props">

                                <!-- //ToDo: Tooltip desglosando puntos por sesiones-->
                                <template v-if="props.row.gps.has(gp.name)">
                                    <span class="tag is-warning" v-if="props.row.gps.get(gp.name).standings === 1">
                                        {{ props.row.gps.get(gp.name).standings }}
                                    </span>
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
                        </o-table-column>
                    </o-table>

                    <VueApexCharts
                        height="400"
                        type="line"
                        :options="chartStandingsOptions"
                        :series="chartStandings">
                    </VueApexCharts>
                </o-tab-item>
                <o-tab-item label="Estadisticas de usuarios" :value="3" disabled>

                </o-tab-item>
            </o-tabs>

        </template>
        <loading v-else />
    </div>
</template>

<script lang="ts">
    import {defineComponent} from "vue";
    import {useAuthStore} from "@/store/authStore";
    import {useCommunityStore} from "@/store/communityStore";
    import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
    import {communityService, grandPrixService, scoreService, seasonService} from "@/_services";
    import {GrandPrix} from "@/types/GrandPrix";
    import {Competition} from "@/types/Competition";
    import {Season} from "@/types/Season";
    import UserMiniCard from "@/components/user/UserMiniCard.vue";
    import {User} from "@/types/User";
    import {UserPoints} from "@/types/UserPoints";
    import PointsTooltipComponent from "@/components/ranking/PointsTooltipComponent.vue";
    import VueApexCharts from "vue3-apexcharts";

    interface TableEntry {
        'user': User;
        'gps': Map<string, UserPoints>;
        'totalScore': number
    }


    export default defineComponent({
        name: "LandingNavbar",
        components: {
            PrognoPageTitle, UserMiniCard, PointsTooltipComponent, VueApexCharts
        },
        setup() {
            const authStore = useAuthStore();
            const communityStore = useCommunityStore();

            const currentUser = authStore.loggedUser;
            const currentCommunity = communityStore.currentCommunity;
            return { currentUser, currentCommunity };
        },
        data() {
            return {
                activeTab: 0,
                isLoading: true,
                tableHasData: false,
                chosenSeason: {} as Season,
                seasonList: new Array<Season>(),
                gps: new Array<GrandPrix>(),
                gpsWithPoints: new Array<string>(), // Only names
                maxPointsInGrandPrix: new Map<string, number>(),
                maxAccumulatedPointsInGrandPrix: new Map<string, number>(),
                communityMembers: new Map<string, User>(),
                tableData: new Array<TableEntry>(),
                tableDataAcumulada: new Array<TableEntry>(),
                chartSeries: [] as any[],
                chartSeriesAcumuladas: [] as any[],
                chartStandings: [] as any[],
                chartOptions: {
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
                            // @ts-ignore
                            formatter: (codePos: number) => { return [...this.grandPrixList().values()][codePos - 1].name },
                        }
                    },
                },
                chartStandingsOptions: {}
            }
        },
        created() {
            seasonService.getSeasonList().then((seasons) => {
                this.seasonList = [];
                this.seasonList.push(...seasons);
                this.chosenSeason = this.seasonList[this.seasonList.length - 1];
            });

            this.chartOptions = {
                ...this.chartOptions,
                xaxis: {
                    // @ts-ignore
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
        },
        methods: {
            changeSeason() {
                this.loadRanking(this.chosenSeason!.competition, this.chosenSeason!);
            },
            async loadRanking(competition: Competition, season: Season) {
                this.isLoading = true;

                this.tableData = [];
                this.tableDataAcumulada = [];

                this.chartSeries = [];
                this.chartSeriesAcumuladas = [];
                this.chartStandings = [];

                const gpPromise = grandPrixService.getGrandPrixesList(competition, season);
                const membersPromise = communityService.getMembers(this.currentCommunity);
                await Promise.all([
                    gpPromise,
                    membersPromise
                ]).then(result => {
                    const gpList = result[0];
                    const members = result[1];

                    this.gps = gpList;

                    this.communityMembers = new Map<string, User>();
                    members.forEach(miembro => {
                        this.communityMembers.set(miembro.user.username, miembro.user);
                    });
                }).then(async () => {
                    const grandPrixPoints = await scoreService.getUserPointsByGP(this.currentCommunity, competition, season);

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

                    const points = await scoreService.getTotalUserPoints(this.currentCommunity, competition, season);

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
                    this.tableHasData = Object.keys(points).length > 0;
                })

                console.log("termine");
                console.log("ranking loaded");
                this.isLoading = false;
            },
            checkRowClass(row: any, index: number) {
                if (row.user.username === this.currentUser.username) return 'is-user';
                return '';
            },
            grandPrixList(): Array<GrandPrix> {
                return this.gps.filter((gp => this.gpsWithPoints.includes(gp.name)));
            },
            checkAndInsertTrophy(gp: string, score: number) {
                return (this.maxPointsInGrandPrix.get(gp)! == score);
            },
            checkWinnerCell(gp: string, score: number) {
                return (this.maxAccumulatedPointsInGrandPrix.get(gp)! == score);
            }
        },
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
</style>
