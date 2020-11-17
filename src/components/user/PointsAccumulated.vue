<template>
    <div>
        <VueApexCharts height="400" type="line" :options="chartOptions" :series="chartSeries"></VueApexCharts>
    </div>
</template>

<script lang="ts">

import {Component, Prop, Vue} from "vue-property-decorator";
import VueApexCharts from "vue-apexcharts";
import {User} from "@/types/User";
import {grandPrixService, userService} from "@/_services";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";
import {Community} from "@/types/Community";

@Component({
    components: {
        VueApexCharts
    }
})
export default class PointsAccumulated extends Vue {
    private grandPrixes = new Map<string, string>();
    private pointsMap = new Map<string, number>();
    @Prop() private user!: User;

    mounted() {
        grandPrixService.getGrandPrixesList("all", {code: "f1"} as Competition, {name: "2020"} as Season).then(gplist => {
            gplist.forEach(gp => this.grandPrixes.set(gp.code, gp.name));

            // Actualizar leyenda con los codigos de los gps
            this.chartOptions = {
                xaxis: {
                    categories: [...this.grandPrixes.keys()],
                }
            }
        }).then(() => {

            // Fixme: Datos reales del usuario iniciado sesión
            let community = {id: 1} as Community;
            let competitition = {id: 1} as Competition;
            let season = {id: 3} as Season;
            //-----

            userService.getCumulatedPointsInCommunity(this.user, community, competitition, season).then(cumulatedPoints => {
                let dataAcumulada = [...Object.values(cumulatedPoints)];
                userService.getPointsInCommunity(this.user, community, competitition, season).then(points => {
                    let dataPoints = [...Object.values(points)];
                    this.chartSeries = [
                        {
                            name: 'Puntos acumulados',
                            data: dataAcumulada
                        },
                        {
                            name: 'Puntos por Gan Premio',
                            data: dataPoints
                        }
                    ]
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

<style scoped>

</style>