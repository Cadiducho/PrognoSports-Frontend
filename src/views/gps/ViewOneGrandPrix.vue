<template>
    <div id="grandprix" class="container-fluid">
        <div v-if="isLoadingGrandPrix || grandPrix === undefined">
            <loading />
        </div>
        <div v-else>
            <b-breadcrumb :items="breadcumbItems" />

            <b-row>
                <b-col sm="9">
                    <PrognoPageTitle :name="grandPrix.name + ' de ' + grandPrix.season.name + ' de '" />
                </b-col>
                <b-col sm="3">
                    <GrandPrixPagination :grand-prix="grandPrix"/>
                </b-col>
            </b-row>

            <b-row>
                <div v-bind:class="[startGrid !== undefined ? 'col-sm-6' : '', 'col-sm-9']">
                    <b-card no-body>
                        <b-tabs card>
                            <b-tab title="Clasificación" active>
                                <h6 class="font-weight-light">La hora de cierre de este pronóstico para la <strong>clasificación</strong> es {{humanDateMinusFive(grandPrix.qualiTime)}}</h6>
                                <SelectDrivers :gp="grandPrix" />
                            </b-tab>
                            <b-tab title="Carrera">
                                <h6 class="font-weight-light">La hora de cierre de este pronóstico para la <strong>carrera</strong> es {{humanDateMinusFive(grandPrix.raceTime)}}</h6>
                                <form id="formRace">
                                    <div class="form-group">
                                    </div>
                                </form>
                            </b-tab>
                        </b-tabs>
                    </b-card>
                </div>
                <b-col v-if="startGrid !== undefined" sm="3">
                    <StartGrid />
                </b-col>
                <b-col sm="3">
                    <CircuitCard :circuit="grandPrix.circuit" :laps="grandPrix.laps" />
                </b-col>
            </b-row>
        </div>
    </div>
</template>

<script lang="ts">
    import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
    import GrandPrixPagination from "@/components/gps/GrandPrixPagination.vue";
    import CircuitCard from "@/components/gps/CircuitCard.vue";
    import StartGrid from "@/components/gps/StartGrid.vue";
    import SelectDrivers from "@/components/gps/SelectDrivers.vue";
    import moment from "moment-timezone";
    import {Component, Vue} from "vue-property-decorator";
    import {GrandPrixesModule} from "@/_store/modules/GrandPrixesModule";
    import {UserModule} from "@/_store/modules/UserModule";
    import {Competition} from "@/types/Competition";
    import {Season} from "@/types/Season";

    @Component({
        components: {
            SelectDrivers,
            CircuitCard,
            PrognoPageTitle,
            GrandPrixPagination,
            StartGrid
        },
        beforeRouteEnter(to: any, from: any, next: any) {
            let competition = {code: to.params.competition} as Competition;
            let season = {name: to.params.season} as Season;
            let payload = {competition: competition, season: season, id: to.params.id}
            GrandPrixesModule.fetchGrandPrix(payload).then(next());
        }
    })
    export default class ViewOneGrandPrix extends Vue {
        private profile = UserModule.profile;
        private isLoadingGrandPrix = GrandPrixesModule.isLoadingGrandPrix;
        private grandPrix = GrandPrixesModule.grandPrix;

        breadcumbItems = [
            {
                text: 'Inicio',
                to: '/home'
            },
            {
                text: 'Grandes Premios',
                to: '/gps'
            },
            {
                text: this.isLoadingGrandPrix ? this.grandPrix.name : 'Grand Prix', //FixMe: Siempre sale GrandPrix. Creo que no se actualiza la variable breadcumbItems una vez se declara
                active: true
            }
        ];

        public humanDateMinusFive(date: any) {
            return moment(String(date))
                .subtract(5, 'minutes')
                .tz(this.profile.preferences.get('time-zone-id'))
                .format('DD/MM/YYYY HH:mm:ss');
        }

        public timeLeft(date: any) {
            return moment(String(date))
                .tz(this.profile.preferences.get('time-zone-id'))
                .fromNow();
        }
    }
</script>