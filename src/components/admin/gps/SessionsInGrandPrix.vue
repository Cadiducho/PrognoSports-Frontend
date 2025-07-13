<template>
  <label class="label">Sesiones</label>
  <section class="flex flex-wrap flex-column">
    <div
      v-if="!sessions.length"
      class="column"
    >
      <PrognoAlert
        variant="warning"
        class="mt-2"
      >
        No hay sesiones configuradas
      </PrognoAlert>
    </div>

    <div
      v-for="ses in sessions"
      :key="ses.id"
      class="py-2"
    >
      <router-link :to="{ name: 'adminGpEditSession', params: { session: ses.id } }">
        <article
          class="card"
          :class="{
            '!bg-cyan-200': currentSession?.id === ses.id,
            'hover:!bg-cyan-100': currentSession?.id !== ses.id
          }"
        >
          <div class="card-content">
            <p class="subtitle mb-2">
              {{ ses.humanName() }}
              <span
                v-if="currentSession?.id === ses.id"
                class="inline-block px-2 py-1 leading-none bg-orange-200 text-orange-800 rounded-full font-semibold uppercase tracking-wide text-xs"
              >
                Editando
              </span>
            </p>

            <div class="content">
              <p class="card-text mb-0">
                <i class="fa-solid fa-pencil mr-2" />
                <b>Code: </b> {{ ses.name }}
              </p>
              <p class="card-text">
                <i class="fa-solid fa-calendar-days mr-2" />
                <b>Fecha: </b> {{ humanDateTime(ses.date) }}
              </p>
            </div>
          </div>
        </article>
      </router-link>
    </div>
    <div class="py-2 flex-1">
      <PButton
        v-if="!isCreatingSession"
        color="info"
        expanded
        @click="isCreatingSession = true"
      >
        Agregar sesión
      </PButton>

      <PCard
        v-else
      >
        <PSelect
          v-model="newSession.session"
          label="Sesión"
          placeholder="Selecciona un tipo de sesión"
        >
          <option
            v-for="ses in availableSessionList"
            :key="ses.id"
            :value="ses"
          >
            {{ ses.humanName() }}
          </option>
        </PSelect>
        <PSelect
          v-model="newSession.session.type"
          label="Define parrilla de"
          placeholder="Selecciona un tipo de sesión"
        >
          <option
            v-for="ses in sessions"
            :value="ses"
          >
            {{ ses.humanName() }} del {{ humanDate(ses.date) }}
          </option>
        </PSelect>

        <PField label="Fecha">
          <Calendar
            :value="newSession.date"
            :options="calendarOptions"
            @input="newSession.date = $event;"
          />
        </PField>

        <button
          class="button is-primary is-fullwidth"
          @click="addSessionToGP()"
        >
          Añadir
        </button>
      </PCard>
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
import PSelect from "@/components/lib/forms/PSelect.vue";
import PField from "@/components/lib/forms/PField.vue";
import PCard from "@/components/lib/PCard.vue";
import PButton from "@/components/lib/forms/PButton.vue";

export default defineComponent({
    name: "SessionsInGrandPrix",
    components: {PButton, PCard, PField, PSelect, PrognoAlert, Calendar },
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
