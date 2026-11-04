<template>
  <PPage>
    <PWizard :wizard="wizard">
      <template #step-0>
        <PFormGrid :cols="4">
          <PInput
            v-model="gpData.name"
            label="Nombre del Gran Premio"
            placeholder="Gran Premio de España"
            name="name"
            :span="3"
          />
          <PInput
            :model-value="gpData.code"
            label="Código"
            message="Siglas, 2 o 3 letras (p. ej. BRA, UAE, AZ)"
            placeholder="ESP"
            name="code"
            :max-lenght="3"
            @update:model-value="gpData.code = String($event ?? '').toUpperCase()"
          />
        </PFormGrid>
        <PrognoAlert
          variant="info"
          class="mt-4"
        >
          Al pulsar «Crear gran premio» se guarda en el servidor. Después podrás añadirlo a una o varias temporadas y crear sus sesiones.
        </PrognoAlert>
      </template>

      <template #step-1>
        <p class="mb-4 text-gray-600 dark:text-gray-300">
          Elige las temporadas en las que se disputa <b>{{ gpData.name }}</b>, con su circuito, vueltas y ronda.
        </p>
        <Loading v-if="!circuits" />
        <SeasonLinker
          v-else
          :linked-season-ids="linkedSeasons.map(season => season.id)"
          :create-model="emptyGrandPrixSeasonModel"
          :is-valid="isGrandPrixSeasonModelValid"
          :submit="linkToSeason"
          @linked="onLinked"
          @pending="pendingLinks = $event"
        >
          <template #fields="{ season, model, update }">
            <GrandPrixSeasonFields
              :model-value="model"
              :circuits="circuits"
              :season="season"
              @update:model-value="update"
            />
          </template>
        </SeasonLinker>
        <PrognoAlert
          v-if="pendingLinks > 0"
          variant="warning"
          class="mt-4"
        >
          Hay temporadas seleccionadas sin enlazar. Si continúas, no se guardarán.
        </PrognoAlert>
      </template>

      <template #step-2>
        <p
          v-if="!linkedSeasons.length"
          class="text-gray-600 dark:text-gray-300"
        >
          No has enlazado el gran premio a ninguna temporada, así que no se pueden crear sesiones. Puedes saltar este paso.
        </p>
        <template v-else>
          <p class="mb-4 text-gray-600 dark:text-gray-300">
            Añade las sesiones (clasificación, carrera...) con su fecha en cada temporada. Puedes hacerlo más tarde desde la edición del gran premio.
          </p>
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <PCard
              v-for="season in linkedSeasons"
              :key="season.id"
              :title="`${season.name} · ${season.competition?.name ?? ''}`"
              padding="sm"
            >
              <GrandPrixSessionsPlanner
                :grand-prix="gpInSeason(season)"
                :session-types="sessionTypes"
                @added="sessionsAdded++"
              />
            </PCard>
          </div>
        </template>
      </template>

      <template #step-3>
        <WizardSummary
          :title="`${gpData.name} creado`"
          :seasons="linkedSeasons"
          :season-link="(season) => ({name: 'adminGpEditInSeason', params: {season: season.id, gp: createdGrandPrix!.id}})"
        >
          <template #details>
            <p
              v-if="sessionsAdded"
              class="text-gray-600 dark:text-gray-300"
            >
              Se han creado {{ sessionsAdded === 1 ? '1 sesión' : `${sessionsAdded} sesiones` }}.
            </p>
          </template>
          <PButton
            v-if="createdGrandPrix"
            tag="router-link"
            :to="{name: 'adminGpEdit', params: {gp: createdGrandPrix.id}}"
            icon="fa fa-pen"
          >
            Ir a la ficha del gran premio
          </PButton>
          <PButton
            tag="router-link"
            :to="{name: 'adminGps'}"
            type="outline"
            color="info"
          >
            Volver a la lista de grandes premios
          </PButton>
        </WizardSummary>
      </template>
    </PWizard>
  </PPage>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {circuitService, grandPrixService, notificationService, sessionService} from "@/_services";
import {GrandPrix} from "@/types/GrandPrix";
import {Season} from "@/types/Season";
import {Circuit} from "@/types/Circuit";
import {RaceSession} from "@/types/RaceSession";
import {useWizard} from "@/composables/useWizard";
import {isFilled} from "@/utils/adminValidators";
import {
  emptyGrandPrixSeasonModel,
  GrandPrixSeasonModel,
  grandPrixSeasonPayload,
  isGrandPrixSeasonModelValid
} from "@/components/admin/seasons/seasonLinkModels";
import PWizard from "@/components/lib/wizard/PWizard.vue";
import WizardSummary from "@/components/lib/wizard/WizardSummary.vue";
import SeasonLinker from "@/components/admin/seasons/SeasonLinker.vue";
import GrandPrixSeasonFields from "@/components/admin/seasons/GrandPrixSeasonFields.vue";
import GrandPrixSessionsPlanner from "@/components/admin/gps/GrandPrixSessionsPlanner.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import PFormGrid from "@/components/lib/forms/PFormGrid.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PCard from "@/components/lib/PCard.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import Loading from "@/components/lib/Loading.vue";

const gpData = reactive({name: '', code: ''});
const createdGrandPrix = ref<GrandPrix>();
const linkedSeasons = ref<Season[]>([]);
const pendingLinks = ref(0);
const circuits = ref<Circuit[]>();
const sessionTypes = ref<RaceSession[]>([]);
const sessionsAdded = ref(0);

onMounted(async () => {
  const [circuitList, sessionList] = await Promise.allSettled([circuitService.getCircuitList(), sessionService.getSessionList()]);
  circuits.value = circuitList.status === 'fulfilled' ? circuitList.value : [];
  sessionTypes.value = sessionList.status === 'fulfilled' ? sessionList.value : [];
  if (circuitList.status === 'rejected' || sessionList.status === 'rejected') {
    notificationService.showNotification('No se han podido cargar los circuitos o las sesiones', 'error');
  }
});

const createGrandPrix = async () => {
  createdGrandPrix.value = await grandPrixService.createGrandPrix({name: gpData.name.trim(), code: gpData.code.trim()});
  notificationService.showNotification(`Se ha creado el gran premio ${createdGrandPrix.value.name}`);
};

const linkToSeason = (season: Season, model: GrandPrixSeasonModel) =>
  grandPrixService.linkGrandPrixToSeason(season.id, grandPrixSeasonPayload(createdGrandPrix.value!.id, model));

const onLinked = (season: Season) => {
  linkedSeasons.value.push(season);
};

// Lo que necesitan los endpoints de sesiones: competición, temporada e id del GP
const gpInSeason = (season: Season) => ({
  id: createdGrandPrix.value!.id,
  competition: season.competition,
  season,
});

const wizard = useWizard([
  {
    label: 'Gran Premio',
    canAdvance: () => isFilled(gpData.name) && /^[A-Z]{2,3}$/.test(gpData.code),
    onLeave: createGrandPrix,
    lockOnComplete: true,
    nextLabel: 'Crear gran premio',
  },
  {
    label: 'Temporadas',
    description: 'Circuito, vueltas y ronda',
  },
  {
    label: 'Sesiones',
    description: 'Fechas de cada sesión',
    nextLabel: 'Terminar',
  },
  {
    label: 'Resumen',
  },
]);
</script>
