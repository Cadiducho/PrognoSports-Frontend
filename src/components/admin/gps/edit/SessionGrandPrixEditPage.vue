<template>

    <section class="box" v-if="isAdmin(currentUser)">

        <loading v-if="isLoadingData"/>
        <template v-else>

            <div class="columns is-variable is-5">
                <div class="column">
                    <PrognoPageTitle :name="'Administración de ' + grandPrix.name + ' de ' + grandPrix.season.name"/>
                </div>
                <div class="column is-3">
                    <GrandPrixPagination isAdminPag :competition="competition" :grand-prix="grandPrix"/>
                </div>
            </div>

            <div class="block">
                <o-button variant="link" :to="{ name: 'adminGpEdit' }" tag="router-link">
                    Volver al Gran Premio
                </o-button>
            </div>

            <p v-if="!dataLoaded">El Gran Premio {{ id }} {{ session }} no ha sido encontrado</p>
            <template v-else>

                <div class="columns">
                    <div class="column is-one-fifth">
                        <SessionsInGrandPrix :grand-prix="grandPrix" :sessions="grandPrix.sessions"/>
                    </div>

                    <div class="column">
                        <h2 class="title">Datos del {{ grandPrix.name }} en {{ session.humanName() }}</h2>

                        <o-field label="Fecha de la sesión">
                            <bulma_calendar :value="session.date" :options="calendarOptions"
                                            v-on:input="session.date = $event;"/>
                        </o-field>

                        <button class="button is-primary mt-0" @click="changeSessionData()">
                            Editar datos de la sesión
                        </button>

                        <hr/>

                        <!-- Si no es quali, hay resultados y grid-->
                        <div v-if="session.name !== 'QUALIFY'" class="columns">
                            <div class="column">
                                <EditResults :grandPrix="grandPrix" :session="session" :resultsInSession="resultsInSession" />
                            </div>
                            <div class="column">
                                <h3 class="subtitle">Parrilla de {{ session.humanName() }}</h3>
                            </div>
                        </div>
                        <!-- En caso contrario mostrar solo selector de resultados -->
                        <EditResults v-else :grandPrix="grandPrix" :session="session" :resultsInSession="resultsInSession" />

                    </div>
                </div>
            </template>
        </template>

    </section>
    <section class="box" v-else>
        <AlertNoPermission/>
    </section>
</template>

<script lang="ts">
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import { SlickList, SlickItem } from 'vue-slicksort';
import bulma_calendar from "bulma-calendar/dist/components/vue/bulma_calendar.vue";
import {
    driversService,
    grandPrixService,
    sessionService
} from "@/_services";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";
import {GrandPrix} from "@/types/GrandPrix";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import SessionsInGrandPrix from "@/components/admin/gps/edit/SessionsInGrandPrix.vue";
import {RaceSession} from "@/types/RaceSession";
import {Driver} from "@/types/Driver";
import {useStyles} from "@/composables/useStyles";
import {StartGridPosition} from "@/types/StartGridPosition";
import GrandPrixPagination from "@/components/gps/GrandPrixPagination.vue";
import EditResults from "@/components/admin/gps/edit/EditResults.vue";

// ToDo: Alterar grid si no contiene QUALIFY
// ToDo: Vuelta rápida si es RACE
export default defineComponent({
    name: "GrandPrixEditPage",
    components: {
        EditResults,
        AlertNoPermission,
        PrognoPageTitle,
        SessionsInGrandPrix,
        SlickList,
        SlickItem,
        GrandPrixPagination,
        bulma_calendar
    },
    setup() {
        const authStore = useAuthStore();
        const styles = useStyles();

        const currentUser = authStore.user;
        const styleDriverCard = styles.styleDriverCard;
        const styleDorsal = styles.styleDorsal;

        return {currentUser, styleDriverCard, styleDorsal};
    },
    data() {
        return {
            competition: {code: this.$route.params.competition} as Competition,
            season: {name: this.$route.params.season} as Season,
            id: this.$route.params.id as string,
            session: {name: this.$route.params.session} as RaceSession,

            notSendNotification: false,
            notOverrideGrid: false,
            fastLap: {} as Driver,
            resultsInSession: new Array<Driver>(),
            startGrid: new Array<StartGridPosition>(),

            grandPrix: {} as GrandPrix,
            dataLoaded: false,
            isLoadingData: true,

            calendarOptions: {
                dateFormat: 'dd/MM/yyyy',
                lang: 'es',
                showTodayButton: false,
                showClearButton: false,
                weekStart: 1,
                validateLabel: 'Confirmar',
                minuteSteps: 1,
            }
        }
    },
    methods: {
        changeSessionData() {
            sessionService.updateSessionInGrandPrix(this.grandPrix, this.session).then(() => {
                this.$oruga.notification.open({
                    position: 'top',
                    message: "Datos de la sesión actualizados.",
                    variant: "success",
                });
            });
        },
        saveResults() {
            const payload = {
                results: new Map(this.resultsInSession.map((driver, index, array) => [index + 1, driver.id])),
                notSendNotification: this.notSendNotification,
            };
            grandPrixService.saveResults(this.grandPrix, this.session, payload).then(() => {
                this.$oruga.notification.open({
                    position: 'top',
                    message: "¡Has guardado los resultados!",
                    variant: "success",
                });
            });
        }
    },
    mounted() {
        grandPrixService.getGrandPrix(this.competition, this.season, this.id)
            .then(gp => {
                this.grandPrix = gp;
                this.competition = gp.competition;
                this.season = gp.season;

                Promise.all([
                    sessionService.getOneSessionInGrandPrix(this.grandPrix, this.session.name),
                    driversService.getDriversInGrandPrix(gp),
                    grandPrixService.getGrandPrixGrid(this.grandPrix, this.session),
                    grandPrixService.getResults(this.grandPrix, this.session)
                ]).then(result => {
                    const ses = result[0];
                    const driversInGP = result[1];
                    const startGrid = result[2];
                    const rawResultsInSession = result[3];

                    this.session = ses;

                    this.startGrid = [];
                    this.startGrid.push(...startGrid);

                    // Si hay resultados, agregarlos a la lista de resultados
                    this.resultsInSession = [];
                    if (rawResultsInSession && rawResultsInSession.length) {
                        rawResultsInSession.forEach((rs) => {
                            this.resultsInSession.push(rs.driver);
                        });
                    } else {

                        // Si hay una grid para esa sesión, ordeno los pilotos en base a eso
                        // Facilita posteriormente ordenar los resultados de la sesión
                        if (startGrid && startGrid.length) {
                            startGrid.forEach((gridPos) => {
                                this.resultsInSession.push(gridPos.driver);
                            });
                        } else {
                            this.resultsInSession.push(...driversInGP);
                        }
                    }

                    this.dataLoaded = true;
                });
            }).finally(() => {
                this.isLoadingData = false;
            }
        );
    }
});
</script>