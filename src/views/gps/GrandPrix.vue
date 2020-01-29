<template>
    <div id="grandprix" class="container-fluid">
        <div v-if="isLoadingGrandPrix || grandPrix === undefined">
            <loading />
        </div>
        <div v-else>
            <b-breadcrumb :items="breadcumbItems" />

            <b-row>
                <b-col sm="9">
                    <PrognoPageTitle :name="grandPrix.name + ' de ' + grandPrix.season" />
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

<script>
    import store from "@/_store";
    import {FETCH_GRAND_PRIX} from "@/_store/actions.type";
    import {mapGetters, mapState} from "vuex";
    import PrognoPageTitle from "@/components/lib/PrognoPageTitle";
    import GrandPrixPagination from "@/components/gps/GrandPrixPagination";
    import CircuitCard from "@/components/gps/CircuitCard";
    import StartGrid from "@/components/gps/StartGrid";
    import moment from "moment-timezone";
    import SelectDrivers from "@/components/gps/SelectDrivers";

    export default {
        name: "GrandPrix",
        components: {
            SelectDrivers,
            CircuitCard,
            PrognoPageTitle,
            GrandPrixPagination,
            StartGrid
        },
        data() {
            return {
                breadcumbItems: [
                    {
                        text: 'Inicio',
                        to: '/home'
                    },
                    {
                        text: 'Grandes Premios',
                        to: '/gps'
                    },
                    {
                        text: this.$store.getters.grandPrix.name,
                        active: true
                    }
                ],
            }
        },
        beforeRouteEnter(to, from, next) {
            let payload = {'season': to.params.season, 'id': to.params.id};
            store.dispatch(FETCH_GRAND_PRIX, payload).then(next());
        },
        computed: {
            ...mapGetters(["isLoadingGrandPrix", "grandPrix", "startGrid"]),
            ...mapState({
                profile: state => state.user.profile,
            })
        },
        methods: {
            humanDateMinusFive(date) {
                return moment(String(date)).subtract(5, 'minutes').tz(this.profile.preferences['time-zone-id']).format('DD/MM/YYYY HH:mm:ss');
            },
            timeLeft(date) {
                return moment(String(date)).tz(this.profile.preferences['time-zone-id']).fromNow();
            }
        }
    }
</script>

<style scoped>

</style>