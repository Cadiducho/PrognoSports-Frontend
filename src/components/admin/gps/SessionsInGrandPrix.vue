<template>
    <label class="label">Sesiones</label>
    <section class="columns is-multiline is-flex-direction-column is-3">
        <div v-if="!sessions.length" class="column">
            <PrognoAlert variant="warning" class="mt-2">
                No hay sesiones configuradas
            </PrognoAlert>
        </div>

        <div v-for="ses in sessions" class="column">
            <router-link :to="{ name: 'adminGpEditSession', params: { session: ses.id } }">
                <article class="card" :class="{
                    '!bg-cyan-200': currentSession?.id === ses.id,
                    'hover:!bg-cyan-100': currentSession?.id !== ses.id
                }">
                    <div class="card-content">
                        <p class="subtitle mb-2">
                            {{ ses.humanName() }}
                            <span v-if="currentSession?.id === ses.id"
                                  class="inline-block px-2 py-1 leading-none bg-orange-200 text-orange-800 rounded-full font-semibold uppercase tracking-wide text-xs">
                                Editando
                            </span>
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
                <o-field label="Define parrilla de">
                    <o-select placeholder="Selecciona una sesión existente" v-model="newSession.defineGridOf" expanded>
                        <option v-for="ses in sessions" :value="ses">{{ ses.humanName() }} del {{ humanDate(ses.date) }}</option>
                    </o-select>
                </o-field>
                <o-field label="Fecha">
                    <Calendar :value="newSession.date" :options="calendarOptions" v-on:input="newSession.date = $event;" />
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
import {notificationService, sessionService} from "@/_services";
import Calendar from "@/components/lib/Calendar.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";

export default defineComponent({
    name: "SessionsInGrandPrix",
    components: {PrognoAlert, Calendar },
    props: {
        grandPrix: {
            type: Object as PropType<GrandPrix>,
            required: true,
        },
        sessions: {
            type: Object as PropType<Array<RaceSession>>,
            required: true
        },
        currentSession: {
            type: Object as PropType<RaceSession>,
            required: false
        }
    },
    setup() {
        const dayjs = useDayjs();

        const humanDateTime = dayjs.humanDateTime;
        const humanDate = dayjs.humanDate;
        return { humanDateTime, humanDate };
    },
    data() {
        return {
            isCreatingSession: false,
            availableSessionList: new Array<RaceSession>(),
            newSession: {
                session: {} as RaceSession,
                defineGridOf: {} as RaceSession,
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
            if (this.newSession.session.id) {
                const data = {
                    session: this.newSession.session.id,
                    date: this.newSession.date,
                    defining: this.newSession.defineGridOf?.id ?? 0
                };
                sessionService.addSessionInGrandPrix(this.grandPrix, data).then((session) => {
                    this.isCreatingSession = false;
                    this.sessions.push(session);
                    notificationService.showNotification('Sesión agregada correctamente');
                }).catch(() => {
                    notificationService.showNotification('Error al agregar la sesión', 'error');
                });
            }
        }
    }
});
</script>
