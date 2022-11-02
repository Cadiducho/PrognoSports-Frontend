<template>
    <label class="label">Sesiones</label>
    <section class="columns is-multiline is-flex-direction-column is-3">
        <div v-if="!sessions.length" class="column">
            <o-notification variant="warning" class="mt-2">
                No hay sesiones configuradas
            </o-notification>
        </div>

        <div v-for="ses in sessions" class="column">
            <router-link class="circuit" :to="{ name: 'adminGpEditSession', params: { session: ses.name } }">
                <article class="card">
                    <div class="card-content">
                        <p class="subtitle mb-2">
                            {{ ses.humanName() }}
                        </p>

                        <div class="content">
                            <p class="card-text mb-0">
                                <i class="fa-solid fa-pencil mr-2"></i>
                                <b>Code: </b> {{ ses.name }}
                            </p>
                            <p class="card-text">
                                <i class="fa-solid fa-calendar-days mr-2"></i>
                                <b>Fecha: </b> {{ humanDateTime(ses.date) }}
                            </p>
                        </div>
                    </div>

                </article>
            </router-link>
        </div>
        <div class="column">
            <button class="button is-primary is-fullwidth" v-if="!isCreatingSession" @click="isCreatingSession = true">Agregar sesión</button>
            <section class="box" v-else>
                <o-field label="Sesión">
                    <o-select placeholder="Selecciona un tipo de sesión" v-model="newSession.session" expanded>
                        <option v-for="ses in availableSessionList" :value="ses">{{ ses.humanName() }}</option>
                    </o-select>
                </o-field>
                <o-field label="Fecha">
                    <bulma_calendar :value="newSession.date" :options="calendarOptions" v-on:input="newSession.date = $event;" />
                </o-field>
                <button class="button is-primary is-fullwidth" @click="addSessionToGP()">Añadir</button>
            </section>
        </div>
    </section>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {GrandPrix} from "@/types/GrandPrix";
import {useDayjs} from "@/composables/useDayjs";
import {RaceSession} from "@/types/RaceSession";
import {sessionService} from "@/_services";
import bulma_calendar from "bulma-calendar/dist/components/vue/bulma_calendar.vue";

export default defineComponent({
    name: "SessionsInGrandPrix",
    components: { bulma_calendar },
    props: {
        grandPrix: {
            type: Object as PropType<GrandPrix>,
            required: true,
        },
        sessions: {
            type: Object as PropType<Array<RaceSession>>,
            required: true
        }
    },
    setup() {
        const dayjs = useDayjs();

        const humanDateTime = dayjs.humanDateTime;
        return { humanDateTime };
    },
    data() {
        return {
            isCreatingSession: false,
            availableSessionList: new Array<RaceSession>(),
            newSession: {
                session: {} as RaceSession,
                date: new Date(),
            },
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
    mounted() {
        sessionService.getSessionList().then((list) => {
            this.availableSessionList = [];
            this.availableSessionList.push(...list);
        })
    },
    methods: {
        addSessionToGP() {
            if (Object.keys(this.newSession.session).length != 0) {
                const data = { session: this.newSession.session.name, date: this.newSession.date };
                sessionService.addSessionInGrandPrix(this.grandPrix, data).then((session) => {
                    this.isCreatingSession = false;
                    console.log(this.sessions);
                    this.sessions.push(session);
                    console.log(this.sessions)
                })
            }
        }
    }
});
</script>

<style scoped>

</style>