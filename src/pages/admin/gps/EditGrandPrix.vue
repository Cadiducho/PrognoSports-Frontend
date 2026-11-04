<template>
  <PPage
    :title="grandPrix?.name"
    :loading="isLoading"
    :not-found="!grandPrix && `El Gran Premio ${route.params.gp} no ha sido encontrado`"
  >
    <PFormGrid
      :cols="4"
      class="mb-4"
    >
      <PInput
        v-model="form.name"
        label="Nombre"
        name="name"
        :span="3"
      />
      <PInput
        :model-value="form.code"
        label="Código del Gran Premio"
        message="Siglas, 2 o 3 letras (p. ej. BRA, UAE, AZ)"
        name="code"
        @update:model-value="form.code = String($event ?? '').toUpperCase()"
      />
    </PFormGrid>

    <PButton
      :disabled="!isDataOk || isSaving"
      label="Guardar cambios"
      color="primary"
      @click="editGrandPrix"
    />

    <PDivider />

    <EntitySeasonsPanel
      v-if="grandPrix && circuits"
      :load="() => grandPrixService.getSeasonMembershipsOfGrandPrix(grandPrix!.id)"
      :create-model="emptyGrandPrixSeasonModel"
      :is-valid="isGrandPrixSeasonModelValid"
      :submit="(season, model) => grandPrixService.linkGrandPrixToSeason(season.id, grandPrixSeasonPayload(grandPrix!.id, model))"
      :edit-route="(season) => ({name: 'adminGpEditInSeason', params: {season: season.id, gp: grandPrix!.id}})"
    >
      <template #entry="{ entry }">
        Ronda {{ entry.round }}<template v-if="entry.circuit">
          · {{ entry.circuit.name }}
        </template>
        <span
          v-if="entry.suspended"
          class="ml-1 rounded-full bg-error-100 px-2 text-xs text-error-800 dark:bg-error-900/40 dark:text-error-300"
        >Suspendido</span>
      </template>
      <template #fields="{ season, model, update }">
        <GrandPrixSeasonFields
          :model-value="model"
          :circuits="circuits"
          :season="season"
          @update:model-value="update"
        />
      </template>
    </EntitySeasonsPanel>
  </PPage>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import {circuitService, grandPrixService, notificationService} from "@/_services";
import {GrandPrix} from "@/types/GrandPrix";
import {Circuit} from "@/types/Circuit";
import {errorMessage} from "@/composables/errorMessage";
import {isFilled} from "@/utils/adminValidators";
import {
  emptyGrandPrixSeasonModel,
  grandPrixSeasonPayload,
  isGrandPrixSeasonModelValid
} from "@/components/admin/seasons/seasonLinkModels";
import EntitySeasonsPanel from "@/components/admin/seasons/EntitySeasonsPanel.vue";
import GrandPrixSeasonFields from "@/components/admin/seasons/GrandPrixSeasonFields.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import PFormGrid from "@/components/lib/forms/PFormGrid.vue";
import PDivider from "@/components/lib/PDivider.vue";

const route = useRoute();

const grandPrix = ref<GrandPrix>();
const circuits = ref<Circuit[]>();
const isLoading = ref(true);
const isSaving = ref(false);
const form = reactive({name: '', code: ''});

onMounted(async () => {
  try {
    grandPrix.value = await grandPrixService.getGrandPrix(route.params.gp as string);
    form.name = grandPrix.value.name;
    form.code = grandPrix.value.code;
  } catch {
    grandPrix.value = undefined;
  } finally {
    isLoading.value = false;
  }

  try {
    circuits.value = await circuitService.getCircuitList();
  } catch {
    circuits.value = [];
    notificationService.showNotification("No se han podido cargar los circuitos", "error");
  }
});

const isDataOk = computed(() => isFilled(form.name) && isFilled(form.code));

const editGrandPrix = async () => {
  if (!grandPrix.value || !isDataOk.value) return;
  isSaving.value = true;
  try {
    const result = await grandPrixService.editGrandPrix({
      id: grandPrix.value.id,
      name: form.name.trim(),
      code: form.code.trim(),
    });
    grandPrix.value.name = result?.name ?? form.name;
    grandPrix.value.code = result?.code ?? form.code;
    notificationService.showNotification("Se ha editado correctamente el gran premio `" + grandPrix.value.name + "`");
  } catch (e) {
    notificationService.showNotification(errorMessage(e) ?? "No se ha podido editar el gran premio", "error");
  } finally {
    isSaving.value = false;
  }
};
</script>
