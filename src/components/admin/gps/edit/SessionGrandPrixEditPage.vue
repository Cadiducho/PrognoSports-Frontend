<template>
    <div id="adminDrivers" class="box">

        <section v-if="isAdmin(currentUser)">

            <loading v-if="isLoadingData" />
            <template v-else>

                <div class="columns is-variable is-5">
                    <div class="column">
                        <PrognoPageTitle :name="'Administración de ' + grandPrix.name + ' de ' + grandPrix.season.name" />
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
                            <SessionsInGrandPrix :grand-prix="grandPrix" :sessions="grandPrix.sessions" />
                        </div>
                        <div class="column">
                            <h2 class="title">Datos del {{ grandPrix.name }} en {{ session.humanName()}} </h2>

                            <o-field label="Fecha de la sesión">
                                <bulma_calendar :value="session.date" :options="calendarOptions" v-on:input="session.date = $event;" />
                            </o-field>

                            <button class="button is-primary mt-0" @click="changeSessionData()">Editar datos de la sesión</button>
                            <hr/>

                            <h3 class="subtitle">Resultados en {{ session.humanName()}} </h3>

                            <section v-if="session.name === 'RACE'" class="mb-4">
                                <o-field label="Vuelta rápida">
                                    <o-select v-model="fastLap" placeholder="Selecciona un circuito" expanded>
                                        <option
                                            v-for="driver in resultsInSession"
                                            :value="driver"
                                            :key="driver.id">
                                            {{ driver.lastname}}, {{driver.firstname}} - {{ driver.team.name }} ({{ driver.team.carname }})
                                        </option>
                                    </o-select>
                                </o-field>
                            </section>
                            <hr/>

                            <label class="label">Resultados</label>
                            <SlickList v-if="resultsInSession" v-model:list="resultsInSession" tag="ul" :distance="1"
                                       class="block-list no-select">

                                <SlickItem v-for="(item, index) in resultsInSession" :key="item.id" :index="index" tag="li"
                                           class="is-highlighted has-text-weight-semibold has-radius is-flex is-justify-content-left"
                                           :style="styleDriverCard(item)">

                                    <span>
                                        <b>{{ index + 1 }}º.</b> {{ item.firstname }} {{ item.lastname }}
                                        <span class="tag is-rounded" v-bind:style="styleDorsal(item)">#{{ item.number }}</span>
                                        <o-tooltip class="ml-1" :label="currentUser.preferences['use-long-team-names'] ? item.team.name : item.team.longname">
                                            <span v-if="currentUser.preferences['use-long-team-names']">{{ item.team.longname }}</span>
                                            <span v-else>{{ item.team.name }}</span>
                                        </o-tooltip>
                                        ({{item.team.carname}})
                                    </span>
                                </SlickItem>
                            </SlickList>

                            <section class="block mt-4">
                                <o-checkbox
                                    v-model="notSendNotification"
                                    variant="danger"
                                    passive-variant="primary">
                                    NO enviar notificación
                                </o-checkbox>
                                <o-checkbox
                                    v-model="notOverrideGrid"
                                    variant="danger"
                                    passive-variant="primary">
                                    NO sobreescribir parrilla
                                </o-checkbox>
                            </section>

                            <button class="button is-primary" @click="saveResults()">Guardar resultados</button>
                        </div>
                    </div>
                </template>
            </template>

        </section>
        <section v-else>
            <AlertNoPermission />
        </section>
    </div>
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

// ToDo: Alterar grid si no contiene QUALIFY
// ToDo: Vuelta rápida si es RACE
export default defineComponent({
    name: "GrandPrixEditPage",
    components: {
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