<template>
    <div id="pointsChart">
        <loading v-if="loading"></loading>
        <VueApexCharts v-else
                       height="400"
                       :type="getChartType()"
                       :options="chartOptions"
                       :series="chartSeries">
        </VueApexCharts>
        <b-button @click="changeGraphType()" type="is-info is-light" expanded>
            Cambiar tipo de gráfica
        </b-button>
    </div>
</template>

<script lang="ts">

import {Component, Prop, Vue, Watch} from "vue-property-decorator";
import VueApexCharts from "vue-apexcharts";
import {User} from "@/types/User";
import {grandPrixService, seasonService, userService} from "@/_services";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";
import {Community} from "@/types/Community";
import {namespace} from "vuex-class";
const Auth = namespace('Auth')

interface IChartType {
    name: string,
    options: {position: string, floating: boolean}
}

@Component<PointsAccumulated>({
    components: {
        VueApexCharts
    }
})
export default class PointsAccumulated extends Vue {
    private grandPrixes = new Map<string, string>();
    private loading: boolean = false;
    private chartTypeIndex: number = 0;
    @Auth.State("community") private currentCommunity!: Community;
    @Prop() private user!: User;


    private chartTypes = new Map<number, IChartType>([
        [0, {
            name: "area",
            options: {
                position: 'top',
                floating: true,
            }
        }],
        [1, {
            name: "radar",
            options: {
                position: 'left',
                floating: true,
            }
        }]
        //ToDo: Más charts? tipo Bar?
    ]);

    mounted() {
        this.loading = true;
        if (this.currentCommunity) {
            this.fetchData();
        }
    }

    private changeGraphType() {
        this.chartTypeIndex = (this.chartTypeIndex + 1) % this.chartTypes.size;//% 3;
    }

    private getChartType(): string {
        let chartType = this.chartTypes.get(this.chartTypeIndex);
        if (chartType === undefined) {
            return "area";
        }

        this.chartOptions.legend = chartType.options;
        return chartType.name;
        /*
        switch (this.chartType) {
            case 1: {
                this.chartOptions.legend = {
                    position: 'left',
                    floating: true,
                };
                return "radar";
            }
           /* case 2: {
                this.chartOptions.legend = {
                    position: 'top',
                    floating: true,
                };
                return "bar";
            }*
        }
        this.chartOptions.legend = {
            position: 'top',
            floating: true,
        };
        return "area";*/
    }

    @Watch('currentCommunity')
    onCurrentCommunityChange(community: Community) {
        this.fetchData();
    }

    public fetchData(): void {
        let season: Season;
        let competition: Competition = this.currentCommunity.competition;

        seasonService.getCurrentSeason(competition).then((seasonFetched) => {
            season = seasonFetched;

        }).then(() => {
            grandPrixService.getGrandPrixesList("all", competition, season).then(gplist => {
                gplist.forEach(gp => this.grandPrixes.set(gp.code, gp.name));

                // Actualizar leyenda con los codigos de los gps
                this.chartOptions = {
                    ...this.chartOptions,
                    xaxis: {
                        categories: [...this.grandPrixes.keys()],
                    }
                }
            }).then(() => {

                userService.getCumulatedPointsInCommunity(this.user, this.currentCommunity, competition, season).then(cumulatedPoints => {
                    let dataAcumulada = [...Object.values(cumulatedPoints)];
                    userService.getPointsInCommunity(this.user, this.currentCommunity, competition, season).then(points => {
                        let dataPoints = [...Object.values(points)];
                        this.chartSeries = [
                            ...this.chartSeries,
                            {
                                name: 'Puntos acumulados',
                                data: dataAcumulada
                            },
                            {
                                name: 'Puntos por Gran Premio',
                                data: dataPoints
                            }
                        ]

                        this.loading = false;
                    });
                });
            });
        });
    }

    private chartSeries: any = [];

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
                formatter: (codePos: number) => { return [...this.grandPrixes.values()][codePos - 1] },
            }
        },
    };
}
</script>