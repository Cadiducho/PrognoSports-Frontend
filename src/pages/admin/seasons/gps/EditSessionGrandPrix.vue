<template>
  <loading v-if="isLoadingData" />
  <template v-else-if="!dataLoaded">
    <p>El Gran Premio {{ id }} de {{ season.name }} en {{ session.name }} no ha sido encontrado</p>
  </template>
  <template v-else>
    <GrandPrixPageHeader
      :grand-prix="grandPrix"
      :competition="competition"
      :is-admin="true"
    />

    <nav class="flex my-4">
      <p-button
        color="info"
        icon="fa fa-chevron-left"
        :to="{ name: 'adminGpEditInSeason' }"
        tag="router-link"
        class="mr-2"
      >
        Volver a administración del Gran Premio
      </p-button>
      <p-button
        color="success"
        icon="fa fa-eye"
        :to="{ name: 'gpdetails', params: {gp: grandPrix.id, season: grandPrix.season.name, competition: grandPrix.competition.code} }"
        tag="router-link"
        class="mr-2"
      >
        Ir al Gran Premio
      </p-button>
    </nav>

    <p v-if="!dataLoaded">
      El Gran Premio {{ id }} {{ session }} no ha sido encontrado
    </p>
    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div class="md:col-span-1">
          <SessionsInGrandPrix
            :grand-prix="grandPrix"
            :sessions="grandPrix.sessions"
            :current-session="session"
          />
        </div>

        <div class="md:col-span-4">
          <PTitle tag="h2">
            {{ session.humanName() }} en {{ grandPrix.name }}
          </PTitle>

          <PCard class="mb-2">
            <PrognoAlert
              v-if="session.defineGridOf?.length"
              variant="info"
            >
              Esta sesión define la parrilla de la sesión: {{
                session.defineGridOf.map(ses => ses.humanName()).join(', ')
              }}
            </PrognoAlert>
            <PrognoAlert
              v-else
              variant="danger"
            >
              Esta sesión no define la parrilla de ninguna sesión
            </PrognoAlert>

            <form class="mb-4">
              <PLabel label="Fecha de la sesión" />
              <Calendar
                :value="session.date"
                :options="calendarOptions"
                @input="session.date = $event;"
              />

              <div class="flex flex-wrap my-2">
                <PLabel
                  class="w-full"
                  label="Define la parrilla de salida de las siguientes sesiones:"
                />
                <p-checkbox
                  v-for="ses in grandPrix.sessions.filter(gps => gps.id !== session.id)"
                  :id="ses.id"
                  :key="ses.id"
                  :checked="session.defineGridOf.map(dfg => dfg.id).includes(ses.id)"
                  @change="toggleDefiningGridSelection(ses, $event.target.checked)"
                >
                  {{ ses.humanName() }}
                </p-checkbox>
              </div>

              <p-button
                label="Actualizar datos de la sesión"
                @click="changeSessionData"
              />
            </form>
          </PCard>

          <!-- Si es sesión con grid, mostrar resultados y grid-->
          <div
            v-if="session.hasGrid"
            class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <section class="md:col-span-1">
              <EditGrid
                :grand-prix="grandPrix"
                :session="session"
                :grid="startGrid"
                :has-saved-grid="hasSavedGrid"
              />
            </section>
            <section class="md:col-span-1">
              <EditResults
                :grand-prix="grandPrix"
                :session="session"
                :results-in-session="resultsInSession"
                :has-saved-results="hasSavedResults"
              />
            </section>
          </div>

          <!-- En caso contrario mostrar solo selector de resultados -->
          <EditResults
            v-else
            :grand-prix="grandPrix"
            :session="session"
            :results-in-session="resultsInSession"
          />
        </div>
      </div>
    </template>
  </template>
</template>

<script lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import {
  driversService,
  grandPrixService, notificationService,
  sessionService
} from "@/_services";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";
import {GrandPrix} from "@/types/GrandPrix";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import SessionsInGrandPrix from "@/components/admin/gps/SessionsInGrandPrix.vue";
import {RaceSession} from "@/types/RaceSession";
import {Driver} from "@/types/Driver";
import {useStyles} from "@/composables/useStyles";
import {StartGridPosition} from "@/types/StartGridPosition";
import EditResults from "@/components/admin/gps/EditResults.vue";
import Calendar from "@/components/lib/Calendar.vue";
import EditGrid from "@/components/admin/gps/EditGrid.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import PCheckbox from "@/components/lib/forms/PCheckbox.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PLabel from "@/components/lib/forms/PLabel.vue";
import GrandPrixPageHeader from "@/components/gps/GrandPrixPageHeader.vue";
import PCard from "@/components/lib/PCard.vue";

export default defineComponent({
  name: "EditSessionGrandPrix",
  components: {
    PCard,
    GrandPrixPageHeader,
    PLabel,
    PButton,
    PCheckbox,
    PrognoAlert,
    EditGrid,
    EditResults,
    PTitle,
    SessionsInGrandPrix,
    Calendar
  },
  setup() {
    const authStore = useAuthStore();
    const styles = useStyles();

    const currentUser = authStore.loggedUser;
    const styleDriverCard = styles.styleDriverCard;
    const styleDorsal = styles.styleDorsal;

    return {currentUser, styleDriverCard, styleDorsal};
  },
  data() {
    return {
      competition: {code: this.$route.params.competition} as Competition,
      season: {name: this.$route.params.season} as Season,
      id: this.$route.params.gp as string,
      session: {id: parseInt(this.$route.params.session.toString())} as RaceSession,

      notSendNotification: false,
      notOverrideGrid: false,
      fastLap: {} as Driver,
      resultsInSession: new Array<Driver>(),
      hasSavedResults: false,
      startGrid: new Array<StartGridPosition>(),
      hasSavedGrid: false,

      grandPrix: {} as GrandPrix,
      sessionsToDefineGrid: [] as Array<RaceSession>,
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
  async mounted() {
    try {
      const gp = await grandPrixService.getGrandPrixInSeason(this.season, this.id);
      this.grandPrix = gp;
      this.competition = gp.competition;
      this.season = gp.season;

      const result = await Promise.all([
        sessionService.getOneSessionInGrandPrix(this.grandPrix, this.session.id),
        driversService.getDriversInGrandPrix(gp),
        grandPrixService.getGrandPrixGrid(this.grandPrix, this.session),
        grandPrixService.getResults(this.grandPrix, this.session)
      ])
      const ses = result[0];
      const driversInGP = result[1];
      const startGridRes = result[2];
      const rawResultsInSession = result[3];

      this.session = ses;

      this.startGrid = [];
      this.startGrid.push(...startGridRes);
      this.hasSavedGrid = this.startGrid.length != 0;
      this.sessionsToDefineGrid = [...this.session.defineGridOf];

      // Si hay resultados, agregarlos a la lista de resultados
      this.resultsInSession = [];
      if (rawResultsInSession && rawResultsInSession.length) {
        this.hasSavedResults = true;
        rawResultsInSession.forEach((rs) => {
          this.resultsInSession.push(rs.driver);
        });
      } else {
        // Si hay una grid para esa sesión, ordeno los pilotos en base a eso
        // Facilita posteriormente ordenar los resultados de la sesión
        if (this.startGrid && this.startGrid.length) {
          this.startGrid.forEach((gridPos) => {
            this.resultsInSession.push(gridPos.driver);
          });
        } else {
          this.resultsInSession.push(...driversInGP);

          // Si no hay grid, relleno esta por defecto con la lista de pilotos para poder ordenarla después
          driversInGP.forEach((driver, index) => {
            this.startGrid.push({
              gp: gp,
              driver: driver,
              position: index + 1,
              isFromPit: false,
              note: ''
            });
          });
        }
      }

      this.dataLoaded = true;
    } catch (error: any) {
      notificationService.showNotification("No se ha encontrado el gran premio", "error");
      console.log(error);
    } finally {
      this.isLoadingData = false;
    }
  },
  methods: {
    toggleDefiningGridSelection(session: RaceSession, checked: boolean) {
      if (checked) {
        this.sessionsToDefineGrid.push(session)
      } else {
        this.sessionsToDefineGrid = this.sessionsToDefineGrid.filter((i: RaceSession) => i.id !== session.id)
      }
    },
    changeSessionData() {
      const data = {
        date: this.session.date,
        defineGridOf: this.sessionsToDefineGrid.map((session: RaceSession) => session.id)
      }
      sessionService.updateSessionInGrandPrix(this.grandPrix, this.session, data).then(() => {
        notificationService.showNotification("Datos de la sesión actualizados.");
      });
    },
    saveResults() {
      const payload = {
        results: new Map(this.resultsInSession.map((driver, index, array) => [index + 1, driver.id])),
        notSendNotification: this.notSendNotification,
      };
      grandPrixService.saveResults(this.grandPrix, this.session, payload).then(() => {
        notificationService.showNotification("¡Has guardado los resultados!");
      });
    }
  }
});
</script>
