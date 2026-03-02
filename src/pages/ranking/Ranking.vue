<template>
  <div id="rankingComponent">
    <PTitle name="Ranking" />

    <PCard>
      <nav class="block flex justify-between">
        <PField label="Temporada">
          <PSelect
            v-if="Object.keys(chosenSeason).length"
            v-model="chosenSeason"
            placeholder="Selecciona la temporada"
            @change="changeSeason()"
          >
            <option
              v-for="season in orderedSeasonList"
              :key="season.id"
              :value="season"
            >
              {{ season.competition.name }} {{ season.name }}
            </option>
          </PSelect>
        </PField>
      </nav>


      <loading v-if="isLoading" />
      <template v-else>
        <PrognoAlert
          v-if="!tableHasData"
          variant="danger"
        >
          No hay datos de esta temporada
        </PrognoAlert>

        <o-tabs
          v-else
          v-model="activeTab"
        >
          <o-tab-item
            label="Ranking por Gran Premio"
            :value="0"
          >
            <PTitle type="subtitle">
              Ranking por Gran Premio
            </PTitle>
            <p class="content">
              Los ganadores de cada Gran Premio tendrán representado un <PIcon icon="fas fa-trophy" />
            </p>
            <o-table
              :data="tableData"
              hoverable
              :mobile-cards="false"
              default-sort="totalScore"
              default-sort-direction="DESC"
              :row-class="checkRowClass"
            >
              <o-table-column
                v-slot="props"
                label="Pos."
                sortable
                numeric
              >
                <span class="has-text-weight-bold">#{{ props.index + 1 }}</span>
              </o-table-column>

              <o-table-column
                field="user.username"
                label="Nombre"
                sortable
              >
                <template #default="props">
                  <o-tooltip
                    position="right"
                    variant="light"
                  >
                    <template #content>
                      <UserMiniCard :user="communityMembers.get(props.row.user.username)" />
                    </template>

                    <span class="has-text-weight-bold">{{ props.row.user.username }}</span>
                  </o-tooltip>
                </template>
              </o-table-column>

              <o-table-column
                v-for="gp in grandPrixList()"
                :key="gp.code"
                field="pointsInGP"
                sortable
                numeric
              >
                <template #header="{ column }">
                  <PTooltip :label="gp.name">
                    {{ gp.code }}
                  </PTooltip>
                </template>
                <template #default="props">
                  <PointsTooltipComponent
                    v-if="props.row.gps.has(gp.id)"
                    :gp-name="gp.name"
                    :user-points="props.row.gps.get(gp.id)"
                    :display-points="props.row.gps.get(gp.id).pointsInGP"
                  />
                  <template v-else>
                    0 :(
                  </template>

                  <PTooltip
                    v-if="props.row.gps.get(gp.id)?.pointsInGP && checkAndInsertTrophy(gp.id, props.row.gps.get(gp.id).pointsInGP)"
                    :label="'Ganador de ' + gp.name"
                  >
                    <span class="text-blue-500">
                      <PIcon icon="fas fa-trophy" />
                    </span>
                  </PTooltip>
                </template>
              </o-table-column>

              <o-table-column
                v-slot="props"
                field="totalScore"
                label="Total"
                sortable
                numeric
              >
                <span class="has-text-weight-bold">{{ props.row.totalScore }}</span>
              </o-table-column>
            </o-table>

            <h1 class="title is-4 mt-4">
              Puntos por Gran Premio
            </h1>
            <VueApexCharts
              ref="chartPointsComp"
              height="400"
              type="line"
              :options="chartOptions"
              :series="chartSeries"
            />
          </o-tab-item>
          <o-tab-item
            label="Ranking acumulado"
            :value="1"
          >
            <PTitle type="subtitle">
              Ranking acumulado
            </PTitle>
            <p class="content">
              La puntuación marcada en
              <PTag
                color="warning"
                size="small"
              >
                dorado
              </PTag> es la máxima acumulada para ese Gran Premio<br>
            </p>
            <o-table
              :data="tableDataAcumulada"
              hoverable
              :mobile-cards="false"
              default-sort="totalScore"
              default-sort-direction="DESC"
              :row-class="checkRowClass"
            >
              <o-table-column
                v-slot="props"
                label="Pos."
                sortable
                numeric
              >
                <span class="has-text-weight-bold">#{{ props.index + 1 }}</span>
              </o-table-column>

              <o-table-column
                field="user.username"
                label="Nombre"
                sortable
              >
                <template #default="props">
                  <o-tooltip
                    position="right"
                    variant="light"
                  >
                    <template #content>
                      <UserMiniCard :user="communityMembers.get(props.row.user.username)" />
                    </template>

                    <span class="has-text-weight-bold">{{ props.row.user.username }}</span>
                  </o-tooltip>
                </template>
              </o-table-column>

              <o-table-column
                v-for="gp in grandPrixList()"
                :key="gp.code"
                :field="gp.code"
                sortable
                numeric
              >
                <template #header="{ column }">
                  <PTooltip :label="gp.name">
                    {{ gp.code }}
                  </PTooltip>
                </template>
                <template #default="props">
                  <template v-if="props.row.gps.has(gp.id)">
                    <PTag
                      v-if="checkWinnerCell(gp.id, props.row.gps.get(gp.id).accumulatedPoints)"
                      color="warning"
                      size="small"
                    >
                      <PointsTooltipComponent
                        :gp-name="gp.name"
                        :user-points="props.row.gps.get(gp.id)"
                        :display-points="props.row.gps.get(gp.id).accumulatedPoints"
                      />
                    </PTag>
                    <template v-else>
                      <PointsTooltipComponent
                        :gp-name="gp.name"
                        :user-points="props.row.gps.get(gp.id)"
                        :display-points="props.row.gps.get(gp.id).accumulatedPoints"
                      />
                    </template>
                  </template>
                  <template v-else>
                    0 :(
                  </template>
                </template>
              </o-table-column>
            </o-table>

            <h1 class="title is-4 mt-4">
              Puntos acumulados
            </h1>
            <p class="content">
              La puntuación marcada en
              <PTag
                color="warning"
                size="small"
              >
                dorado
              </PTag> es la máxima acumulada para ese Gran Premio<br>
            </p>

            <h1 class="title is-4 mt-4">
              Puntos acumulados por Gran Premio
            </h1>
            <VueApexCharts
              ref="chartAcumuladasComp"
              height="400"
              type="line"
              :options="chartOptions"
              :series="chartSeriesAcumuladas"
            />
          </o-tab-item>
          <o-tab-item
            label="Ranking por aciertos"
            :value="2"
          >
            <PTitle type="subtitle">
              Aciertos
            </PTitle>
            <o-table
              :data="tableDataAciertos"
              hoverable
              :mobile-cards="false"
              default-sort="totalScore"
              default-sort-direction="DESC"
              :row-class="checkRowClass"
            >
              <o-table-column
                field="user.username"
                label="Nombre"
                sortable
              >
                <template #default="props">
                  <o-tooltip
                    position="right"
                    variant="light"
                  >
                    <template #content>
                      <UserMiniCard :user="communityMembers.get(props.row.user.username)" />
                    </template>

                    <span class="has-text-weight-bold">{{ props.row.user.username }}</span>
                  </o-tooltip>
                </template>
              </o-table-column>

              <o-table-column
                v-for="gp in grandPrixList()"
                :key="gp.code"
                :field="gp.code"
                sortable
                numeric
              >
                <template #header="{ column }">
                  <PTooltip :label="gp.name">
                    {{ gp.code }}
                  </PTooltip>
                </template>
                <template #default="props">
                  <template v-if="props.row.gps.has(gp.id)">
                    <PTag
                      v-if="checkMaxHitsCell(gp.id, props.row.gps.get(gp.id).hitsInGP)"
                      color="warning"
                      size="small"
                    >
                      <HitsTooltipComponent
                        :gp-name="gp.name"
                        :user-points="props.row.gps.get(gp.id)"
                      />
                    </PTag>
                    <template v-else>
                      <template v-if="props.row.gps.get(gp.id).hitsInGP >= 0">
                        <HitsTooltipComponent
                          :gp-name="gp.name"
                          :user-points="props.row.gps.get(gp.id)"
                        />
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

            <h1 class="title is-4 mt-4">
              Aciertos por Gran Premio
            </h1>
            <VueApexCharts
              ref="chartHitsComp"
              height="400"
              type="heatmap"
              :options="chartHitsOptions"
              :series="chartHits"
            />
          </o-tab-item>
          <o-tab-item
            label="Ranking por clasificación"
            :value="3"
          >
            <PTitle type="subtitle">
              Clasificaciones
            </PTitle>
            <o-table
              :data="tableDataAcumulada"
              hoverable
              :mobile-cards="false"
              default-sort="totalScore"
              default-sort-direction="DESC"
              :row-class="checkRowClass"
            >
              <o-table-column
                field="user.username"
                label="Nombre"
                sortable
              >
                <template #default="props">
                  <o-tooltip
                    position="right"
                    variant="light"
                  >
                    <template #content>
                      <UserMiniCard :user="communityMembers.get(props.row.user.username)" />
                    </template>

                    <span class="has-text-weight-bold">{{ props.row.user.username }}</span>
                  </o-tooltip>
                </template>
              </o-table-column>

              <o-table-column
                v-for="gp in grandPrixList()"
                :key="gp.code"
                :field="gp.code"
                sortable
                numeric
              >
                <template #header="{ column }">
                  <PTooltip :label="gp.name">
                    {{ gp.code }}
                  </PTooltip>
                </template>
                <template #default="props">
                  <template v-if="props.row.gps.has(gp.id)">
                    <PTag
                      v-if="props.row.gps.get(gp.id).standings === 1"
                      color="warning"
                      size="small"
                    >
                      {{ props.row.gps.get(gp.id).standings }}
                    </PTag>
                    <template v-else>
                      <template v-if="props.row.gps.get(gp.id).standings >= 1">
                        {{ props.row.gps.get(gp.id).standings }}
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

            <h1 class="title is-4 mt-4">
              Clasificación por Gran Premio
            </h1>
            <VueApexCharts
              ref="chartStandingsComp"
              height="400"
              type="line"
              :options="chartStandingsOptions"
              :series="chartStandings"
            />
          </o-tab-item>
        </o-tabs>
      </template>
    </PCard>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import PTitle from "@/components/lib/PTitle.vue";
import {communityService, grandPrixService, scoreService, seasonService} from "@/_services";
import {GrandPrix} from "@/types/GrandPrix";
import {Season} from "@/types/Season";
import UserMiniCard from "@/components/user/UserMiniCard.vue";
import {User} from "@/types/User";
import {UserPoints} from "@/types/UserPoints";
import PointsTooltipComponent from "@/components/ranking/PointsTooltipComponent.vue";
import VueApexCharts, {VueApexChartsComponent} from "vue3-apexcharts";
import {useThemeStore} from "@/store/themeStore";
import {storeToRefs} from "pinia";
import PCard from "@/components/lib/PCard.vue";
import PField from "@/components/lib/forms/PField.vue";
import PSelect from "@/components/lib/forms/PSelect.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import PTag from "@/components/lib/PTag.vue";
import PTooltip from "@/components/lib/PTooltip.vue";
import PIcon from "@/components/lib/PIcon.vue";
import HitsTooltipComponent from "@/components/ranking/HitsTooltipComponent.vue";

interface TableEntry {
    user: User;
    gps: Map<number, UserPoints>;
    totalScore: number;
}


    export default defineComponent({
        name: "LandingNavbar",
        components: {
          HitsTooltipComponent,
          PIcon,
          PTooltip,
          PrognoAlert,
          PSelect,
          PField,
            PCard,
            PTitle, UserMiniCard, PointsTooltipComponent, VueApexCharts,
          PTag,
        },
        setup() {
            const authStore = useAuthStore();
            const communityStore = useCommunityStore();
            const themeStore = useThemeStore();

            const currentUser = authStore.loggedUser;
            const currentCommunity = communityStore.currentCommunity;
            const { darkMode } = storeToRefs(themeStore);
            const chartStandingsComp = ref<VueApexChartsComponent | null>(null);
            const chartAcumuladasComp = ref<VueApexChartsComponent | null>(null);
            const chartPointsComp = ref<VueApexChartsComponent | null>(null);
            const chartHitsComp = ref<VueApexChartsComponent | null>(null);

            return { currentUser, currentCommunity, darkMode, chartStandingsComp, chartAcumuladasComp, chartPointsComp, chartHitsComp };
        },
        data() {
            return {
                activeTab: 0,
                isLoading: true,
                tableHasData: false,
                chosenSeason: {} as Season,
                seasonList: new Array<Season>(),
                gps: new Array<GrandPrix>(),
                gpsWithPoints: new Array<number>(), // gp ids
                maxPointsInGrandPrix: new Map<number, number>(),
                maxAccumulatedPointsInGrandPrix: new Map<number, number>(),
                maxHitsInGrandPrix: new Map<number, number>(),
                communityMembers: new Map<string, User>(),
                tableData: new Array<TableEntry>(),
                tableDataAcumulada: new Array<TableEntry>(),
                tableDataAciertos: new Array<TableEntry>(),
                chartSeries: [] as any[],
                chartSeriesAcumuladas: [] as any[],
                chartStandings: [] as any[],
                chartHits: [] as any[],
                topScorerUsers: [] as string[], // Lista de los 8 usuarios con más puntos totales en la temporada, para destacar en la gráfica de puntos por GP
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
                            type: 'xy',
                            enabled: true,
                            autoScaleYaxis: true
                        },
                        toolbar: {
                            autoSelected: 'zoom'
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
                    theme: {
                        mode: this.darkMode ? 'dark' : 'light',
                        palette: 'palette8'
                    }
                },
                chartStandingsOptions: {},
                chartHitsOptions: {},
            }
        },
        computed: {
            orderedSeasonList(): Season[] {
                return this.seasonList.sort((a, b) => {
                    return b.id - a.id; // Orden descendente por ID
                });
            },
        },
        watch: {
            darkMode(newDarkMode, oldDarkMode) {
                const theme = {
                    theme: {
                        mode: newDarkMode ? 'dark' : 'light',
                        palette: 'palette8'
                    }
                }
                this.chartAcumuladasComp?.updateOptions(theme);
                this.chartPointsComp?.updateOptions(theme);
                this.chartStandingsComp?.updateOptions(theme);
                this.chartHitsComp?.updateOptions(theme);
            }
        },
        created() {
            this.loadRanking(this.currentCommunity.competition.currentSeason);

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
          this.chartHitsOptions = {
            chart: {
              type: 'heatmap',
              toolbar: {
                show: true
              }
            },
            dataLabels: {
              enabled: true,
              formatter: function(val: any, opts: any) {
                // Mostrar el valor real de aciertos, no el normalizado
                const dataPoint = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex];
                return dataPoint.hits;
              }
            },
            xaxis: {
              type: 'category',
              categories: [...this.gps.map(gp => gp)],
              title: {
                text: 'Grandes Premios'
              }
            },
            yaxis: {
              title: {
                text: 'Usuarios'
              }
            },
            plotOptions: {
              heatmap: {
                colorScale: {
                  ranges: [
                    {from: 0, to: 0, color: '#808080', name: 'Sin datos'},
                    {from: 0.01, to: 33, color: '#ff9f6b', name: 'Bajo'},
                    {from: 33.01, to: 66, color: '#efd800', name: 'Medio'},
                    {from: 66.01, to: 99, color: '#44d63c', name: 'Alto'},
                    {from: 99.01, to: 100, color: '#ae29d0', name: 'Máximo'}
                  ]
                }
              }
            },
            tooltip: {
              y: {
                formatter: function(val: any, opts: any) {
                  const dataPoint = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex];
                  return dataPoint.hits + " aciertos";
                }
              }
            },
            theme: {
              mode: this.darkMode ? 'dark' : 'light'
            }
          }
        },
        methods: {
            changeSeason() {
                this.loadRanking(this.chosenSeason!);
            },
            async loadRanking(season: Season) {
                this.isLoading = true;

                this.tableData = [];
                this.tableDataAcumulada = [];
                this.tableDataAciertos = [];;

                this.chartSeries = [];
                this.chartSeriesAcumuladas = [];
                this.chartStandings = [];
                this.chartHits = [];
                this.topScorerUsers = [];

                const gpPromise = grandPrixService.getGrandPrixesList(season);
                const membersPromise = communityService.getMembers(this.currentCommunity);
                const pointsByGpPromise = scoreService.getUserPointsByGP(this.currentCommunity, season);
                const totalUserPointsPromise = scoreService.getTotalUserPoints(this.currentCommunity, season);

                const [gpList, members, grandPrixPoints, points] = await Promise.all([
                    gpPromise,
                    membersPromise,
                    pointsByGpPromise,
                    totalUserPointsPromise
                ]);

                this.gps = gpList.filter(gp => !gp.suspended); // Para el ranking siempre me van a interesar los gps que NO estén suspendidos
                this.updateChartsLegend();

                this.communityMembers = new Map<string, User>();
                members.forEach(miembro => {
                    this.communityMembers.set(miembro.user.username, miembro.user);
                });

                let entradas: Map<string, TableEntry> = new Map(); // Username -> Entrada de la tabla
                let entradasAcumuladas: Map<string, TableEntry> = new Map(); // Username -> Entrada de la tabla
                let entradasAciertos: Map<string, TableEntry> = new Map(); // Username -> Entrada de la tabla

                members.forEach((member) => {
                    entradas.set(member!.user.username, {
                        gps: new Map(),
                        totalScore: 0,
                        user: member.user!
                    });
                    entradasAcumuladas.set(member!.user.username, {
                        gps: new Map(),
                        totalScore: 0,
                        user: member.user!
                    });
                    entradasAciertos.set(member!.user.username, {
                        gps: new Map(),
                        totalScore: 0,
                        user: member.user!
                    });
                });


                // Para cada gran premio
                Object.entries(grandPrixPoints).forEach(([gp, entry]) => {
                    const gpId = Number(gp);
                    this.gpsWithPoints.push(gpId);
                    this.maxPointsInGrandPrix.set(gpId, -Infinity);
                    this.maxAccumulatedPointsInGrandPrix.set(gpId, -Infinity);
                    this.maxHitsInGrandPrix.set(gpId, -Infinity);

                    // Cada usuario en cada gran premio
                    for (let [slot, userPoints] of Object.entries(entry!)) {
                        let user = userPoints!.user!.username;
                        // asigno entradas a los usuarios existentes, con sus resultados en el gp iterado
                        if (user !== undefined && (entradas.has(user) || entradasAcumuladas.has(user) || entradasAciertos.has(user))) {

                            entradas.get(user)!.gps.set(gpId, userPoints!);
                            entradasAcumuladas.get(user)!.gps.set(gpId, userPoints!);
                            entradasAciertos.get(user)!.gps.set(gpId, userPoints!);

                            if (userPoints!.pointsInGP! > this.maxPointsInGrandPrix.get(gpId)!) {
                                this.maxPointsInGrandPrix.set(gpId, userPoints!.pointsInGP!);
                            }
                            if (userPoints!.accumulatedPoints > this.maxAccumulatedPointsInGrandPrix.get(gpId)!) {
                                this.maxAccumulatedPointsInGrandPrix.set(gpId, userPoints!.accumulatedPoints!);
                            }
                            if (userPoints!.hitsInGP > this.maxHitsInGrandPrix.get(gpId)!) {
                              this.maxHitsInGrandPrix.set(gpId, userPoints!.hitsInGP!);
                            }
                        }
                    }
                });

                // Calcular los top 10 usuarios con más puntos acumulados
                const sortedUsers = Object.entries(points)
                    .filter(([username, totalScore]) => totalScore != 0)
                    .sort((a, b) => b[1] - a[1]) // Ordenar de mayor a menor por totalScore
                    .slice(0, 8)
                    .map(([username]) => username);

                this.topScorerUsers = sortedUsers;

                Object.entries(points).forEach(([username, totalScore]) => {

                    // Agrego a tablas y gráficas sólo si ha recibido alguna puntuación en la temporada
                    if (totalScore != 0) {

                        entradas.get(username)!.totalScore = totalScore || 0;

                        // Utilizo el mismo for de iterar usuarios para guardar las filas
                        // Guardo las entradas creadas en las filas de la tabla
                        this.tableData.push(entradas.get(username)!);
                        this.tableDataAcumulada.push(entradasAcumuladas.get(username)!);
                        this.tableDataAciertos.push(entradasAcumuladas.get(username)!);


                        let chartData = [];
                        let accumulatedChartRawData = [] as { gpId: number, points: number }[];
                        let standingsChartRawData = [] as { gpId: number, standing: number | null, hits: number }[];

                        for (const [gpId, uPoints] of entradas.get(username)!.gps) {
                            chartData.push(uPoints.pointsInGP);

                            // Null para no mostrar si no existe una standing, por ejemplo, no tiene resultados las primeras carreras
                            let standing = (uPoints.standings > 0) ? uPoints.standings : null;
                            let hits = (uPoints.hitsInGP >= 0) ? uPoints.hitsInGP : null;
                            standingsChartRawData.push({gpId, standing, hits});
                        }
                        for (const [gpId, uPoints] of entradasAcumuladas.get(username)!.gps) {
                            accumulatedChartRawData.push({gpId, points: uPoints.accumulatedPoints});
                        }

                        // Ordeno los datos pusheados al array por el orden correcto de los gps
                        accumulatedChartRawData.sort((a, b) => {
                            return this.gps.findIndex(gp => gp.id === a.gpId) - this.gps.findIndex(gp => gp.id === b.gpId);
                        });
                        standingsChartRawData.sort((a, b) => {
                            return this.gps.findIndex(gp => gp.id === a.gpId) - this.gps.findIndex(gp => gp.id === b.gpId);
                        });

                        // Convierto los datos de acumulados y ranking, ya ordenados por gps, a arrays que entiendan las gráficas
                        const accumulatedChartData = accumulatedChartRawData.map(data => data.points);
                        const standingsChartData = standingsChartRawData.map(data => data.standing);
                        const hitsChartData = standingsChartRawData.map(data => data.hits);

                        // Agrego a la gráfica de puntos
                        this.chartSeries = [
                            ...this.chartSeries,
                            {
                                name: username,
                                data: chartData,
                                hidden: (!this.topScorerUsers.includes(username))
                            },
                        ]
                        this.chartSeriesAcumuladas = [
                            ...this.chartSeriesAcumuladas,
                            {
                                name: username,
                                data: accumulatedChartData,
                                hidden: (!this.topScorerUsers.includes(username))
                            },
                        ];
                        this.chartStandings = [
                            ...this.chartStandings,
                            {
                                name: username,
                                data: standingsChartData,
                                hidden: (!this.topScorerUsers.includes(username))
                            },
                        ];

                        const maxHitsByGP = new Map<number, number>();
                        this.gps.forEach(gp => {
                          maxHitsByGP.set(gp.id, this.maxHitsInGrandPrix.get(gp.id) || 0);
                        });

                        this.chartHits = [
                          {
                            name: username,
                            data: this.gps.map(gp => {
                              const userPoints = entradas.get(username)!.gps.get(gp.id);
                              const hits = userPoints?.hitsInGP >= 0 ? userPoints.hitsInGP : 0;
                              const maxHits = maxHitsByGP.get(gp.id) || 1;

                              // Normalizar a porcentaje (0-100) respecto al máximo del GP
                              const normalizedValue = maxHits > 0 ? (hits / maxHits) * 100 : 0;

                              return {
                                x: gp.code,
                                y: normalizedValue,
                                hits: hits, // Mantener el valor real para el tooltip
                                maxHits: maxHits
                              };
                            })
                          },
                          ...this.chartHits
                        ];
                    }
                });
                this.tableHasData = Object.keys(points).length > 0;


                this.isLoading = false;
            },
            checkRowClass(row: any, index: number) {
                if (row.user.username === this.currentUser.username) return 'is-user';
                return '';
            },
            grandPrixList(): Array<GrandPrix> {
                return this.gps.filter(gp => this.gpsWithPoints.includes(Number(gp.id)));
            },
            checkAndInsertTrophy(gp: number, score: number) {
                return (this.maxPointsInGrandPrix.get(gp)! == score);
            },
            checkWinnerCell(gp: number, score: number) {
                return (this.maxAccumulatedPointsInGrandPrix.get(gp)! == score);
            },
            checkMaxHitsCell(gp: number, hits: number) {
                return (this.maxHitsInGrandPrix.get(gp)! == hits);
            },
            updateChartsLegend() {
                // Actualizar leyenda con los codigos de los gps
                const xaxis = {
                    categories: [...this.gps.map(gp => gp.code)],
                }

                this.chartOptions = {
                    ...this.chartOptions,
                    xaxis
                }
                this.chartStandingsOptions = {
                    ...this.chartStandingsOptions,
                    xaxis
                }
                this.chartHitsOptions = {
                    ...this.chartHitsOptions,
                    xaxis
                }
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
