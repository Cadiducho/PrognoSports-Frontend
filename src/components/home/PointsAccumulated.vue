<template>
    <div id="pointsChart">
        <loading class="m-4" v-show="loading"></loading>
        <VueApexCharts v-show="!loading"
            height="400"
            type="area"
            :options="chartOptions"
            :series="chartSeries"
        ></VueApexCharts>
        <p-button label="Ir al Ranking" expanded type="soft" color="info" to="/ranking" />
    </div>
</template>

<script lang="ts">
import {User} from "@/types/User";
import {grandPrixService, seasonService, userService} from "@/_services";
import {Competition} from "@/types/Competition";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import {defineComponent, PropType} from "vue";
import VueApexCharts from "vue3-apexcharts";
import PButton from "@/components/lib/forms/PButton.vue";


export default defineComponent({
    name: "PointsAccumulated",
    components: {
        PButton,
        VueApexCharts,
    },
    props: {
        user: {
            type: Object as PropType<User>,
            required: true
        }
    },
    setup() {
        const authStore = useAuthStore();
        const communityStore = useCommunityStore();

        const currentUser = authStore.loggedUser;
        const thereIsCurrentCommunity = communityStore.thereIsCurrentCommunity;
        const currentCommunity = communityStore.currentCommunity;

        return {currentUser, currentCommunity, thereIsCurrentCommunity};
    },
    data() {
        return {
            loading: false,
            grandPrixes: new Map<string, string>(),
            chartSeries: [] as any[],
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
                        type: 'x',
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
                        formatter: (codePos: number) => { return [...this.grandPrixes.values()][codePos - 1] },
                    }
                },
            }
        }
    },
    mounted() {
        this.loading = true;
        if (this.thereIsCurrentCommunity) {
            this.fetchData();
        }
    },
    methods: {
        async fetchData(): Promise<void> {
            const competition: Competition = this.currentCommunity.competition;
            const season = await seasonService.getCurrentSeason(competition);

            const [gpList, cumulatedPoints, points] = await Promise.all([
                grandPrixService.getGrandPrixesList(season),
                userService.getCumulatedPointsInCommunity(this.user, this.currentCommunity, competition, season),
                userService.getPointsInCommunity(this.user, this.currentCommunity, competition, season)
            ]);

            const filteredGps = gpList.filter(gp => !gp.suspended);

            // Actualizar leyenda con los codigos de los gps
            filteredGps.forEach(gp => this.grandPrixes.set(gp.code, gp.name));
            this.chartOptions = {
                ...this.chartOptions,
                xaxis: {
                    // @ts-ignore
                    categories: [...this.grandPrixes.keys()],
                }
            }


            // Relleno la tabla de puntos acumulados y por gran premio
            this.chartSeries = [
                ...this.chartSeries,
                {
                    name: 'Puntos acumulados',
                    data: [...Object.values(cumulatedPoints)]
                },
                {
                    name: 'Puntos por Gran Premio',
                    data: [...Object.values(points)]
                }
            ];

            this.loading = false;
        }
    },
    watch: {
        currentCommunity(newCommunity, oldcommunity) {
            this.fetchData();
        }
    },
});
</script>