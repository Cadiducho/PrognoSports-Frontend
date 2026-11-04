<template>
  <PPage>
    <PWizard :wizard="wizard">
      <template #step-0>
        <PFormGrid :cols="2">
          <PInput
            v-model="driverData.firstname"
            label="Nombre"
            placeholder="Fernando"
            name="firstname"
          />
          <PInput
            v-model="driverData.lastname"
            label="Apellido"
            placeholder="Alonso"
            name="lastname"
          />
          <PInput
            :model-value="driverData.code"
            label="Código"
            message="Tres letras, como en las tablas de tiempos"
            placeholder="ALO"
            name="code"
            :max-lenght="3"
            @update:model-value="driverData.code = String($event ?? '').toUpperCase()"
          />
          <PInput
            v-model="driverData.nationality"
            label="Nacionalidad"
            placeholder="Española"
            name="nationality"
          />
          <PField label="Fecha de nacimiento">
            <CalendarDateTimePicker
              v-model="driverData.birth"
              placeholder="Click para escoger..."
              :show-time="false"
              :start-date="new Date(2000, 0, 1)"
            />
          </PField>
        </PFormGrid>
        <PrognoAlert
          variant="info"
          class="mt-4"
        >
          Al pulsar «Crear piloto» se guarda en el servidor. Después podrás enlazarlo a una o varias temporadas.
        </PrognoAlert>
      </template>

      <template #step-1>
        <p class="mb-4 text-gray-600 dark:text-gray-300">
          Elige las temporadas en las que corre <b>{{ fullName }}</b> e indica su dorsal y color en cada una.
        </p>
        <SeasonLinker
          :linked-season-ids="linkedSeasons.map(season => season.id)"
          :create-model="emptyDriverSeasonModel"
          :is-valid="isDriverSeasonModelValid"
          :submit="linkToSeason"
          @linked="(season) => linkedSeasons.push(season)"
          @pending="pendingLinks = $event"
          @busy="wizard.setWorking('links', $event)"
        >
          <template #fields="{ model, update }">
            <DriverSeasonFields
              :model-value="model"
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
        <WizardSummary
          :title="`${fullName} creado`"
          :seasons="linkedSeasons"
          :season-link="(season) => ({name: 'adminDriversInSeason', params: {season: season.id}})"
        >
          <PButton
            v-if="createdDriver"
            tag="router-link"
            :to="{name: 'adminDriverEdit', params: {driver: createdDriver.id}}"
            icon="fa fa-pen"
          >
            Ir a la ficha del piloto
          </PButton>
          <PButton
            tag="router-link"
            :to="{name: 'adminDrivers'}"
            type="outline"
            color="info"
          >
            Volver a la lista de pilotos
          </PButton>
        </WizardSummary>
      </template>
    </PWizard>
  </PPage>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import {driversService, notificationService} from "@/_services";
import {Driver} from "@/types/Driver";
import {Season} from "@/types/Season";
import {useWizard} from "@/composables/useWizard";
import {isFilled, isValidDate} from "@/utils/adminValidators";
import {
  DriverSeasonModel,
  driverSeasonPayload,
  emptyDriverSeasonModel,
  isDriverSeasonModelValid
} from "@/components/admin/seasons/seasonLinkModels";
import PWizard from "@/components/lib/wizard/PWizard.vue";
import WizardSummary from "@/components/lib/wizard/WizardSummary.vue";
import SeasonLinker from "@/components/admin/seasons/SeasonLinker.vue";
import DriverSeasonFields from "@/components/admin/seasons/DriverSeasonFields.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import PField from "@/components/lib/forms/PField.vue";
import PFormGrid from "@/components/lib/forms/PFormGrid.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import CalendarDateTimePicker from "@/components/lib/CalendarDateTimePicker.vue";

const driverData = reactive({
  firstname: '',
  lastname: '',
  code: '',
  nationality: '',
  birth: null as Date | null,
});
const createdDriver = ref<Driver>();
const linkedSeasons = ref<Season[]>([]);
const pendingLinks = ref(0);

const fullName = computed(() => `${driverData.firstname} ${driverData.lastname}`.trim());

const isDriverDataValid = computed(() =>
  isFilled(driverData.firstname)
  && isFilled(driverData.lastname)
  && /^[A-Z]{3}$/.test(driverData.code)
  && isFilled(driverData.nationality)
  && isValidDate(driverData.birth)
);

const createDriver = async () => {
  createdDriver.value = await driversService.createDriver({
    firstname: driverData.firstname.trim(),
    lastname: driverData.lastname.trim(),
    code: driverData.code,
    nationality: driverData.nationality.trim(),
    birth: driverData.birth!,
  });
  notificationService.showNotification(`Se ha creado el piloto ${fullName.value}`);
};

const linkToSeason = (season: Season, model: DriverSeasonModel) =>
  driversService.linkDriverToSeason(season, driverSeasonPayload(createdDriver.value!.id, model));

const wizard = useWizard([
  {
    label: 'Datos del piloto',
    canAdvance: () => isDriverDataValid.value,
    onLeave: createDriver,
    lockOnComplete: true,
    nextLabel: 'Crear piloto',
  },
  {
    label: 'Temporadas',
    description: 'Dorsal y color',
    nextLabel: 'Terminar',
  },
  {
    label: 'Resumen',
  },
]);
</script>
