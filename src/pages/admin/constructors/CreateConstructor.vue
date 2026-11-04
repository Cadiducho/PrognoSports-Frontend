<template>
  <PPage>
    <PWizard :wizard="wizard">
      <template #step-0>
        <PFormGrid :cols="2">
          <PInput
            v-model="name"
            label="Nombre del constructor"
            message="Nombre corto y único, como «Red Bull» o «Ferrari»"
            placeholder="Ferrari"
            name="name"
          />
        </PFormGrid>
        <PrognoAlert
          variant="info"
          class="mt-4"
        >
          Al pulsar «Crear constructor» se guarda en el servidor. Después podrás enlazarlo a una o varias temporadas.
        </PrognoAlert>
      </template>

      <template #step-1>
        <p class="mb-4 text-gray-600 dark:text-gray-300">
          Elige las temporadas en las que compite <b>{{ name }}</b> e indica su nombre largo, coche y color en cada una.
        </p>
        <SeasonLinker
          :linked-season-ids="linkedSeasons.map(season => season.id)"
          :create-model="() => emptyConstructorSeasonModel(name.trim())"
          :is-valid="isConstructorSeasonModelValid"
          :submit="linkToSeason"
          @linked="(season) => linkedSeasons.push(season)"
          @pending="pendingLinks = $event"
        >
          <template #fields="{ model, update }">
            <ConstructorSeasonFields
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
          :title="`${name} creado`"
          :seasons="linkedSeasons"
          :season-link="(season) => ({name: 'adminConstructorsInSeason', params: {season: season.id}})"
        >
          <PButton
            v-if="createdConstructor"
            tag="router-link"
            :to="{name: 'adminConstructorEdit', params: {constructorId: createdConstructor.id}}"
            icon="fa fa-pen"
          >
            Ir a la ficha del constructor
          </PButton>
          <PButton
            tag="router-link"
            :to="{name: 'adminConstructors'}"
            type="outline"
            color="info"
          >
            Volver a la lista de constructores
          </PButton>
        </WizardSummary>
      </template>
    </PWizard>
  </PPage>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {constructorService, notificationService} from "@/_services";
import {Constructor} from "@/types/Constructor";
import {Season} from "@/types/Season";
import {useWizard} from "@/composables/useWizard";
import {isFilled} from "@/utils/adminValidators";
import {
  ConstructorSeasonModel,
  constructorSeasonPayload,
  emptyConstructorSeasonModel,
  isConstructorSeasonModelValid
} from "@/components/admin/seasons/seasonLinkModels";
import PWizard from "@/components/lib/wizard/PWizard.vue";
import WizardSummary from "@/components/lib/wizard/WizardSummary.vue";
import SeasonLinker from "@/components/admin/seasons/SeasonLinker.vue";
import ConstructorSeasonFields from "@/components/admin/seasons/ConstructorSeasonFields.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import PFormGrid from "@/components/lib/forms/PFormGrid.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";

const name = ref('');
const createdConstructor = ref<Constructor>();
const linkedSeasons = ref<Season[]>([]);
const pendingLinks = ref(0);

const createConstructor = async () => {
  createdConstructor.value = await constructorService.createConstructor({name: name.value.trim()});
  notificationService.showNotification(`Se ha creado el constructor ${createdConstructor.value.name}`);
};

const linkToSeason = (season: Season, model: ConstructorSeasonModel) =>
  constructorService.linkConstructorToSeason(season.id, constructorSeasonPayload(createdConstructor.value!.id, model));

const wizard = useWizard([
  {
    label: 'Constructor',
    canAdvance: () => isFilled(name.value),
    onLeave: createConstructor,
    lockOnComplete: true,
    nextLabel: 'Crear constructor',
  },
  {
    label: 'Temporadas',
    description: 'Coche, nombre largo y color',
    nextLabel: 'Terminar',
  },
  {
    label: 'Resumen',
  },
]);
</script>
