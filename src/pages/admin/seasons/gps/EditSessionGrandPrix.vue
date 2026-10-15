<template>
  <PPage
    :title="dataLoaded ? `${session.humanName()} en ${grandPrix.name}` : undefined"
    :loading="isLoadingData"
    :not-found="!dataLoaded && `El Gran Premio ${id} de ${season?.name} en ${session?.name} no ha sido encontrado`"
    variant="plain"
  >
    <template #actions>
      <div
        v-if="dataLoaded"
        class="w-60"
      >
        <GrandPrixPagination
          :is-admin-pag="true"
          :competition="grandPrix.competition"
          :grand-prix="grandPrix"
        />
      </div>
    </template>

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

    <template v-if="dataLoaded">
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
              <PField label="Fecha de la sesión">
                <CalendarDateTimePicker
                  v-model="session.date"
                  placeholder="Click para escoger..."
                  :show-time="true"
                />
              </PField>

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
                v-model:has-saved-grid="hasSavedGrid"
                :grand-prix="grandPrix"
                :session="session"
                :grid="startGrid"
              />
            </section>
            <section class="md:col-span-1">
              <EditResults
                v-model:has-saved-results="hasSavedResults"
                :grand-prix="grandPrix"
                :session="session"
                :results-in-session="resultsInSession"
              />
            </section>
          </div>

          <!-- En caso contrario mostrar solo selector de resultados -->
          <EditResults
            v-else
            v-model:has-saved-results="hasSavedResults"
            :grand-prix="grandPrix"
            :session="session"
            :results-in-session="resultsInSession"
          />
        </div>
      </div>
    </template>
  </PPage>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import PTitle from "@/components/lib/PTitle.vue";
import {driversService, grandPrixService, notificationService, sessionService} from "@/_services";
import {Season} from "@/types/Season";
import {GrandPrix} from "@/types/GrandPrix";
import SessionsInGrandPrix from "@/components/admin/gps/SessionsInGrandPrix.vue";
import {RaceSession} from "@/types/RaceSession";
import {Driver} from "@/types/Driver";
import {StartGridPosition} from "@/types/StartGridPosition";
import EditResults from "@/components/admin/gps/EditResults.vue";
import EditGrid from "@/components/admin/gps/EditGrid.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import PCheckbox from "@/components/lib/forms/PCheckbox.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PLabel from "@/components/lib/forms/PLabel.vue";
import GrandPrixPagination from "@/components/gps/GrandPrixPagination.vue";
import PCard from "@/components/lib/PCard.vue";
import PField from "@/components/lib/forms/PField.vue";
import CalendarDateTimePicker from "@/components/lib/CalendarDateTimePicker.vue";

const route = useRoute();

const season = ref<Season>({name: route.params.season} as Season);
const id = route.params.gp as string;
const session = ref<RaceSession>({id: parseInt(route.params.session.toString())} as RaceSession);

const resultsInSession = ref<Array<Driver>>([]);
const hasSavedResults = ref(false);
const startGrid = ref<Array<StartGridPosition>>([]);
const hasSavedGrid = ref(false);

const grandPrix = ref<GrandPrix>({} as GrandPrix);
const sessionsToDefineGrid = ref<Array<RaceSession>>([]);
const dataLoaded = ref(false);
const isLoadingData = ref(true);

onMounted(async () => {
  try {
    const gp = await grandPrixService.getGrandPrixInSeason(season.value, id);
    grandPrix.value = gp;
    season.value = gp.season;

    const [ses, driversInGP, startGridRes, rawResultsInSession] = await Promise.all([
      sessionService.getOneSessionInGrandPrix(gp, session.value.id),
      driversService.getDriversInGrandPrix(gp),
      grandPrixService.getGrandPrixGrid(gp, session.value),
      grandPrixService.getResults(gp, session.value)
    ]);

    session.value = ses;

    startGrid.value = [...startGridRes];
    hasSavedGrid.value = startGrid.value.length != 0;
    sessionsToDefineGrid.value = [...session.value.defineGridOf];

    // Si hay resultados, agregarlos a la lista de resultados
    resultsInSession.value = [];
    if (rawResultsInSession && rawResultsInSession.length) {
      hasSavedResults.value = true;
      rawResultsInSession.forEach((rs) => {
        resultsInSession.value.push(rs.driver);
      });
    } else {
      // Si hay una grid para esa sesión, ordeno los pilotos en base a eso
      // Facilita posteriormente ordenar los resultados de la sesión
      if (startGrid.value.length) {
        startGrid.value.forEach((gridPos) => {
          resultsInSession.value.push(gridPos.driver);
        });
      } else {
        resultsInSession.value.push(...driversInGP);

        // Si no hay grid, relleno esta por defecto con la lista de pilotos para poder ordenarla después
        driversInGP.forEach((driver, index) => {
          startGrid.value.push({
            gp: gp,
            driver: driver,
            position: index + 1,
            isFromPit: false,
            note: ''
          });
        });
      }
    }

    dataLoaded.value = true;
  } catch (error: any) {
    notificationService.showNotification("No se ha encontrado el gran premio", "error");
    console.log(error);
  } finally {
    isLoadingData.value = false;
  }
});

function toggleDefiningGridSelection(ses: RaceSession, checked: boolean) {
  if (checked) {
    sessionsToDefineGrid.value.push(ses);
  } else {
    sessionsToDefineGrid.value = sessionsToDefineGrid.value.filter((i: RaceSession) => i.id !== ses.id);
  }
}

function changeSessionData() {
  const data = {
    date: session.value.date,
    defineGridOf: sessionsToDefineGrid.value.map((ses: RaceSession) => ses.id)
  };
  sessionService.updateSessionInGrandPrix(grandPrix.value, session.value, data).then(() => {
    notificationService.showNotification("Datos de la sesión actualizados.");
  });
}
</script>
