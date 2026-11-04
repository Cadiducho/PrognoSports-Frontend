<template>
  <PPage
    :loading="isLoading"
    :subtitle="`Temporada ${season?.name}`"
  >
    <template #actions>
      <PButton
        tag="router-link"
        :to="{name: 'adminConstructorCreate'}"
        type="outline"
        icon="fa fa-plus"
      >
        Crear constructor nuevo
      </PButton>
    </template>

    <form @submit.prevent="addConstructorToSeason">
      <p-select
        v-model="constructorId"
        label="Constructor"
        placeholder="Selecciona un constructor"
        class="mb-3"
      >
        <option
          v-for="cons in availableConstructors"
          :key="cons.id"
          :value="cons.id"
        >
          {{ cons.name }}
        </option>
      </p-select>

      <ConstructorSeasonFields v-model="seasonData" />

      <PButton
        class="mt-4"
        :disabled="!isFormValid || isSaving"
        native-type="submit"
        label="Agregar constructor a la temporada"
      />
    </form>
  </PPage>
</template>

<script setup lang="ts">
import {constructorService, notificationService, seasonService} from "@/_services";

import {computed, onMounted, ref, watch} from "vue";
import PButton from "@/components/lib/forms/PButton.vue";
import {useRoute, useRouter} from "vue-router";
import PSelect from "@/components/lib/forms/PSelect.vue";
import {Season} from "@/types/Season";
import {Constructor} from "@/types/Constructor";
import ConstructorSeasonFields from "@/components/admin/seasons/ConstructorSeasonFields.vue";
import {
  ConstructorSeasonModel,
  constructorSeasonPayload,
  emptyConstructorSeasonModel,
  isConstructorSeasonModelValid
} from "@/components/admin/seasons/seasonLinkModels";
import {errorMessage} from "@/composables/errorMessage";

const router = useRouter();
const route = useRoute();

const isLoading = ref(true);
const isSaving = ref(false);
const season = ref({} as Season);
const constructorsList = ref([] as Array<Constructor>);
const constructorsInSeason = ref([] as Array<Constructor>);
const constructorId = ref<number | ''>('');
const seasonData = ref<ConstructorSeasonModel>(emptyConstructorSeasonModel());

// Sólo los constructores que aún no están en la temporada
const availableConstructors = computed(() =>
  constructorsList.value.filter(cons => !constructorsInSeason.value.some(inSeason => inSeason.id === cons.id))
);

// Propone el nombre corto como nombre largo si aún no se ha escrito
watch(constructorId, (id) => {
  const selected = constructorsList.value.find(cons => cons.id === id);
  if (selected && !seasonData.value.fullname) {
    seasonData.value = {...seasonData.value, fullname: selected.name};
  }
});

onMounted(async () => {
  try {
    season.value = await seasonService.getSeason(route.params.season as string);
    const [allConstructors, inSeason] = await Promise.all([
      constructorService.getAllConstructors(),
      constructorService.getConstructorsInSeason(season.value),
    ]);
    constructorsList.value = allConstructors;
    constructorsInSeason.value = inSeason;
  } catch (e) {
    notificationService.showNotification(errorMessage(e) ?? "Error al cargar los datos", "error");
  } finally {
    isLoading.value = false;
  }
});

const isFormValid = computed(() => constructorId.value !== '' && isConstructorSeasonModelValid(seasonData.value));

const addConstructorToSeason = async () => {
  if (!isFormValid.value) return;
  isSaving.value = true;
  try {
    const result = await constructorService.linkConstructorToSeason(season.value.id, constructorSeasonPayload(constructorId.value as number, seasonData.value));
    notificationService.showNotification("Se ha añadido correctamente el constructor `" + result.name + "`");

    await router.push({
      name: 'adminConstructorsInSeason'
    })
  } catch (error) {
    notificationService.showNotification(errorMessage(error) ?? "No se ha podido añadir el constructor", "error");
  } finally {
    isSaving.value = false;
  }
}
</script>
