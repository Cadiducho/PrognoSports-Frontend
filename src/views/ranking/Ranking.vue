<template>
    <div id="rankingComponent" class="container-fluid">
        <b-breadcrumb :items="breadcumbItems"></b-breadcrumb>

        <progno-page-title name="Ranking" />
        <b-row>
            <b-col md="12">

                <div class="card mb-grid">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <div class="card-header-title">Ranking individual</div>
                    </div>
                    <template v-if="rankingBusy">
                        <div class="table-responsive-md">
                            <table class="table table-hover mb-0">
                                <thead class="thead-light">
                                    <tr>
                                        <th scope="col">Pos.</th>
                                        <th scope="col">Nombre</th>
                                        <template v-for="gp in gps">
                                            <th :title="gp.name" scope="col">
                                                <router-link class="text-dark" :to="'/gps/' + gp.season + '/' + gp.round">{{ gp.code }}</router-link>
                                            </th>
                                        </template>
                                        <th scope="col">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(gpPoints, user, index) in listOfPoints">
                                        <td><b>#{{ index + 1}}</b></td>
                                        <td><router-link :to="'/u/' + user " class="text-dark">{{ user }}</router-link></td>
                                        <td v-for="points in gpPoints">{{ points }}</td>
                                        <td> {{ totalUserPoints[user] }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </template>
                    <template v-else><loading /></template>
                </div>

                <div class="card mb-grid">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <div class="card-header-title">Ranking acumulado</div>
                    </div>
                    <template v-if="gps !== undefined">
                        <div class="table-responsive-md">
                            <table class="table table-hover mb-0">
                                <thead class="thead-light">
                                <tr>
                                    <th scope="col">Pos.</th>
                                    <th scope="col">Nombre</th>
                                    <template v-for="gp in gps">
                                        <th :title="gp.name" scope="col">
                                            <router-link class="text-dark" :to="'/gps/' + gp.season + '/' + gp.round">{{ gp.code }}</router-link>
                                        </th>
                                    </template>
                                </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>
                    </template>
                    <template v-else><loading /></template>
                </div>

                <div class="card mb-grid">
                    <div class="card-header">
                        Puntos por Gran Premio
                    </div>
                    <div class="card-body">
                        <div id="points-by-gp-chart"></div>
                    </div>
                </div>

                <div class="card mb-grid">
                    <div class="card-header">
                        Puntos acumulados
                    </div>
                    <div class="card-body">
                        <div id="points-accumulated-chart"></div>
                    </div>
                </div>
            </b-col>
        </b-row>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
    import {grandPrixService, scoreService} from "@/_services";
    import {GrandPrix} from "@/types/GrandPrix";
    import {Competition} from "@/types/Competition";
    import {Season} from "@/types/Season";

    @Component({
        components: {
            PrognoPageTitle
        }
    })
    export default class Ranking extends Vue {
        private rankingBusy: boolean = true;
        private gps!: Array<GrandPrix>;
        private listOfPoints: any;
        private totalUserPoints: any;
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
            let competition = { id: 1} as Competition;
            let season = { id: 3} as Season;
            grandPrixService.getGrandPrixesList('all', competition, season).then(gps => {
                this.gps = gps;
                this.checkRankingLoaded();
            });
            scoreService.getUserPointsByGP(1, 2019).then(points => {
                this.listOfPoints = points;
                this.checkRankingLoaded();
            });
            scoreService.getTotalUserPoints(1, 2019).then(points => {
                this.totalUserPoints = points;
                this.checkRankingLoaded();
            });
        }

        public checkRankingLoaded() {
            this.rankingBusy = this.gps !== undefined && this.listOfPoints !== undefined;
        }
    }
</script>