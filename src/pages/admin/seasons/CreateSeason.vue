<template>
  <PPage>
    <PWizard :wizard="wizard">
      <template #step-0>
        <PFormGrid :cols="3">
          <p-select
            v-model="seasonData.competitionId"
            label="Competición"
            placeholder="Selecciona una competición"
          >
            <option
              v-for="comp in competitions"
              :key="comp.id"
              :value="comp.id"
            >
              {{ comp.name }} ({{ comp.code }}) - {{ comp.fullname }}
            </option>
          </p-select>

          <PInput
            v-model="seasonData.name"
            label="Nombre de la temporada"
            placeholder="2026"
            name="name"
          />

          <PField label="Número de eventos totales">
            <PNumberInput
              v-model="seasonData.totalEvents"
              :min="1"
            />
          </PField>
        </PFormGrid>

        <PrognoAlert
          variant="info"
          class="mt-4"
        >
          Al pulsar «Crear temporada» se guarda en el servidor. Después podrás copiar la parrilla de otra temporada.
        </PrognoAlert>
      </template>

      <template #step-1>
        <p class="mb-4 text-gray-600 dark:text-gray-300">
          Copia los constructores y pilotos de otra temporada a <b>{{ createdSeason?.name }}</b>. Revisa los datos que cambien (coches, dorsales, colores) antes de copiar.
        </p>
        <SeasonGridImporter
          v-if="createdSeason"
          :target-season="createdSeason"
          @imported="imported = $event"
          @busy="wizard.setWorking('import', $event)"
        />
      </template>

      <template #step-2>
        <WizardSummary :title="`Temporada ${createdSeason?.name} creada`">
          <template #details>
            <p class="text-gray-600 dark:text-gray-300">
              <template v-if="imported.constructors || imported.drivers">
                Se han copiado {{ imported.constructors }} constructores y {{ imported.drivers }} pilotos.
              </template>
              <template v-else>
                No se ha copiado ninguna parrilla. Puedes hacerlo más tarde desde la temporada.
              </template>
            </p>
          </template>
          <template v-if="createdSeason">
            <PButton
              tag="router-link"
              :to="{name: 'adminSeasonEdit', params: {season: createdSeason.id}}"
              icon="fa fa-cogs"
            >
              Administrar la temporada
            </PButton>
            <PButton
              tag="router-link"
              :to="{name: 'adminGpsInSeason', params: {season: createdSeason.id}}"
              type="outline"
              color="info"
            >
              Grandes Premios
            </PButton>
            <PButton
              tag="router-link"
              :to="{name: 'adminDriversInSeason', params: {season: createdSeason.id}}"
              type="outline"
              color="info"
            >
              Pilotos
            </PButton>
            <PButton
              tag="router-link"
              :to="{name: 'adminConstructorsInSeason', params: {season: createdSeason.id}}"
              type="outline"
              color="info"
            >
              Constructores
            </PButton>
          </template>
        </WizardSummary>
      </template>
    </PWizard>
  </PPage>
</template>

<script setup lang="ts">
import {competitionService, notificationService} from "@/_services";
import {useCreateSeason} from "@/queries/seasons";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";
import {onMounted, reactive, ref} from "vue";
import {useWizard} from "@/composables/useWizard";
import {isFilled, isIntAtLeast} from "@/utils/adminValidators";
import PWizard from "@/components/lib/wizard/PWizard.vue";
import WizardSummary from "@/components/lib/wizard/WizardSummary.vue";
import SeasonGridImporter from "@/components/admin/seasons/SeasonGridImporter.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import PField from "@/components/lib/forms/PField.vue";
import PFormGrid from "@/components/lib/forms/PFormGrid.vue";
import PNumberInput from "@/components/lib/forms/PNumberInput.vue";
import PSelect from "@/components/lib/forms/PSelect.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";

const seasonData = reactive({
  name: '',
  totalEvents: undefined as number | undefined,
  competitionId: '' as number | '',
});
const competitions = ref<Competition[]>([]);
const createdSeason = ref<Season>();
const imported = ref({constructors: 0, drivers: 0});
// Al terminar invalida la lista de temporadas, que se actualiza sola en las pantallas que la usan
const {mutateAsync: createSeasonMutation} = useCreateSeason();

onMounted(() => {
  competitionService.getCompetitionList().then((list) => {
    competitions.value = list;
  });
});

const createSeason = async () => {
  const created = await createSeasonMutation({
    name: seasonData.name.trim(),
    totalEvents: seasonData.totalEvents!,
    competition: seasonData.competitionId as number,
  });
  // El POST devuelve la competición sólo con el id; se completa para el resto del wizard
  createdSeason.value = {
    ...created,
    competition: competitions.value.find(comp => comp.id === seasonData.competitionId) ?? created.competition,
  };
  notificationService.showNotification(`Se ha creado la temporada ${created.name}`);
};

const wizard = useWizard([
  {
    label: 'Temporada',
    canAdvance: () => isFilled(seasonData.name) && isIntAtLeast(seasonData.totalEvents) && seasonData.competitionId !== '',
    onLeave: createSeason,
    lockOnComplete: true,
    nextLabel: 'Crear temporada',
  },
  {
    label: 'Copiar parrilla',
    description: 'Pilotos y constructores',
    skippable: true,
    nextLabel: 'Terminar',
  },
  {
    label: 'Resumen',
  },
]);
</script>
