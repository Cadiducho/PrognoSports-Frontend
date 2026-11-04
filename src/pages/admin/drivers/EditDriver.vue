<template>
  <PPage
    :title="driver ? `${driver.firstname} ${driver.lastname}` : undefined"
    :loading="isLoading"
    :not-found="!driver && 'El piloto no ha sido encontrado'"
  >
    <template #actions>
      <PButton
        v-if="driver"
        tag="router-link"
        :to="{name: 'driverDetails', params: {driver: driver.id}}"
        color="success"
        icon="fa fa-eye"
      >
        Ver ficha pública
      </PButton>
    </template>

    <PFormGrid
      :cols="2"
      class="mb-4"
    >
      <PInput
        v-model="form.firstname"
        label="Nombre"
        name="firstname"
      />
      <PInput
        v-model="form.lastname"
        label="Apellido"
        name="lastname"
      />
      <PInput
        :model-value="form.code"
        label="Código"
        name="code"
        :max-lenght="3"
        @update:model-value="form.code = String($event ?? '').toUpperCase()"
      />
      <PInput
        v-model="form.nationality"
        label="Nacionalidad"
        name="nationality"
      />
      <PField label="Fecha de nacimiento">
        <CalendarDateTimePicker
          v-model="form.birth"
          placeholder="Click para escoger..."
          :show-time="false"
          :start-date="form.birth ?? new Date(2000, 0, 1)"
        />
      </PField>
    </PFormGrid>

    <PButton
      :disabled="!isFormValid || isSaving"
      label="Guardar cambios"
      @click="save"
    />

    <PDivider />

    <EntitySeasonsPanel
      v-if="driver"
      :load="() => driversService.getSeasonMembershipsOfDriver(driver!.id)"
      :create-model="emptyDriverSeasonModel"
      :is-valid="isDriverSeasonModelValid"
      :submit="(season, model) => driversService.linkDriverToSeason(season, driverSeasonPayload(driver!.id, model))"
      :edit-route="(season) => ({name: 'adminSeasonEditDriver', params: {season: season.id, driver: driver!.id}})"
      :unlink="(season) => driversService.deleteDriversInSeason(season, driver!)"
    >
      <template #entry="{ entry }">
        <span class="inline-flex items-center gap-2">
          <span
            class="inline-block h-3 w-3 rounded-full ring-1 ring-black/10 dark:ring-white/20"
            :style="{backgroundColor: hexColor(entry.color)}"
          />
          Dorsal #{{ entry.number }}
        </span>
      </template>
      <template #fields="{ model, update }">
        <DriverSeasonFields
          :model-value="model"
          @update:model-value="update"
        />
      </template>
    </EntitySeasonsPanel>
  </PPage>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import {driversService, notificationService} from "@/_services";
import {Driver} from "@/types/Driver";
import {errorMessage} from "@/composables/errorMessage";
import {isFilled, isValidDate} from "@/utils/adminValidators";
import {
  driverSeasonPayload,
  emptyDriverSeasonModel,
  isDriverSeasonModelValid
} from "@/components/admin/seasons/seasonLinkModels";
import EntitySeasonsPanel from "@/components/admin/seasons/EntitySeasonsPanel.vue";
import DriverSeasonFields from "@/components/admin/seasons/DriverSeasonFields.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import PField from "@/components/lib/forms/PField.vue";
import PFormGrid from "@/components/lib/forms/PFormGrid.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PDivider from "@/components/lib/PDivider.vue";
import CalendarDateTimePicker from "@/components/lib/CalendarDateTimePicker.vue";

const route = useRoute();

const driver = ref<Driver>();
const isLoading = ref(true);
const isSaving = ref(false);
const form = reactive({
  firstname: '',
  lastname: '',
  code: '',
  nationality: '',
  birth: null as Date | null,
});

const hexColor = (color: string | undefined) => !color ? 'transparent' : color.startsWith('#') ? color : `#${color}`;

const fillForm = (data: Driver) => {
  form.firstname = data.firstname;
  form.lastname = data.lastname;
  form.code = data.code;
  form.nationality = data.nationality;
  form.birth = data.birth ? new Date(data.birth) : null;
};

onMounted(async () => {
  try {
    driver.value = await driversService.getDriver(route.params.driver as string);
    fillForm(driver.value);
  } catch {
    driver.value = undefined;
  } finally {
    isLoading.value = false;
  }
});

const isFormValid = computed(() =>
  isFilled(form.firstname)
  && isFilled(form.lastname)
  && /^[A-Z]{3}$/.test(form.code)
  && isFilled(form.nationality)
  && isValidDate(form.birth)
);

const save = async () => {
  if (!driver.value || !isFormValid.value) return;
  isSaving.value = true;
  try {
    const updated = await driversService.updateDriver({
      id: driver.value.id,
      firstname: form.firstname.trim(),
      lastname: form.lastname.trim(),
      code: form.code,
      nationality: form.nationality.trim(),
      birth: form.birth!,
    });
    driver.value = {...driver.value, ...updated};
    notificationService.showNotification(`Se ha actualizado el piloto ${form.firstname} ${form.lastname}`);
  } catch (e) {
    notificationService.showNotification(errorMessage(e) ?? "No se ha podido actualizar el piloto", "error");
  } finally {
    isSaving.value = false;
  }
};
</script>
