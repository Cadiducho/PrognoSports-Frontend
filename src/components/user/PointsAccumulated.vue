<template>
    <div id="pointsChart">
        <loading v-if="loading"></loading>
        <VueApexCharts v-else height="400" type="line" :options="chartOptions" :series="chartSeries"></VueApexCharts>
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

@Component<PointsAccumulated>({
    components: {
        VueApexCharts
    }
})
export default class PointsAccumulated extends Vue {
    private grandPrixes = new Map<string, string>();
    private loading: boolean = false;
    @Auth.State("community") private currentCommunity!: Community;
    @Prop() private user!: User;

    mounted() {
        this.loading = true;
        if (this.currentCommunity) {
            this.fetchData();
        }
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
            height: 220,
            type: 'line',
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