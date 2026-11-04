<template>
  <PPage
    :title="constructor.name"
    :loading="isLoading"
    :not-found="!constructor.id && 'El constructor no ha sido encontrado'"
  >
    <PFormGrid
      :cols="2"
      class="mb-4"
    >
      <PInput
        v-model="constructor.name"
        label="Nombre del constructor"
        name="name"
      />
    </PFormGrid>

    <PButton
      type="solid"
      label="Guardar cambios"
      :disabled="!isFilled(constructor.name)"
      @click="editConstructor"
    />

    <PDivider />

    <EntitySeasonsPanel
      v-if="constructor.id"
      :load="() => constructorService.getSeasonMembershipsOfConstructor(constructor.id)"
      :create-model="() => emptyConstructorSeasonModel(constructor.name)"
      :is-valid="isConstructorSeasonModelValid"
      :submit="(season, model) => constructorService.linkConstructorToSeason(season.id, constructorSeasonPayload(constructor.id, model))"
      :edit-route="(season) => ({name: 'adminSeasonEditConstructor', params: {season: season.id, constructor: constructor.id}})"
      :unlink="(season) => constructorService.deleteConstructorFromSeason(season.id, constructor)"
    >
      <template #entry="{ entry }">
        <span class="inline-flex items-center gap-2">
          <span
            class="inline-block h-3 w-3 rounded-full ring-1 ring-black/10 dark:ring-white/20"
            :style="{backgroundColor: hexColor(entry.teamcolor)}"
          />
          {{ entry.longname }} · {{ entry.carname }}
        </span>
      </template>
      <template #fields="{ model, update }">
        <ConstructorSeasonFields
          :model-value="model"
          @update:model-value="update"
        />
      </template>
    </EntitySeasonsPanel>
  </PPage>
</template>

<script setup lang="ts">

import PInput from "@/components/lib/forms/PInput.vue";
import PFormGrid from "@/components/lib/forms/PFormGrid.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PDivider from "@/components/lib/PDivider.vue";
import {onMounted, ref} from "vue";
import {constructorService, notificationService} from "@/_services";
import {useRoute} from "vue-router";
import {errorMessage} from "@/composables/errorMessage";
import {isFilled} from "@/utils/adminValidators";
import {
  constructorSeasonPayload,
  emptyConstructorSeasonModel,
  isConstructorSeasonModelValid
} from "@/components/admin/seasons/seasonLinkModels";
import EntitySeasonsPanel from "@/components/admin/seasons/EntitySeasonsPanel.vue";
import ConstructorSeasonFields from "@/components/admin/seasons/ConstructorSeasonFields.vue";

const route = useRoute();

const isLoading = ref(true);

const constructor = ref({
    id: 0,
    name: ''
});

const hexColor = (color: string | undefined) => !color ? 'transparent' : color.startsWith('#') ? color : `#${color}`;

onMounted(() => {
    if (!route.params.constructorId) {
        isLoading.value = false;
        return;
    }
    constructorService.getConstructor(route.params.constructorId as string)
        .then(response => {
            constructor.value = response;
        })
        .catch((e) => {
            console.error(e);
        }).finally(() => {
            isLoading.value = false;
        });
})

const editConstructor = async () => {
    if (!isFilled(constructor.value.name)) {
        return;
    }
    try {
        await constructorService.updateConstructor(constructor.value);
        notificationService.showNotification("Se ha actualizado correctamente el Constructor `" + constructor.value.name + "`", "success");
    } catch (e) {
        notificationService.showNotification(errorMessage(e) ?? "No se ha podido actualizar el constructor", "error");
    }
}
</script>
