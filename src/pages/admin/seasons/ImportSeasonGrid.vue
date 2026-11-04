<template>
  <PPage
    :subtitle="season ? `Temporada ${season.name}` : undefined"
    :loading="isLoading"
    :not-found="!season && 'La temporada no ha sido encontrada'"
  >
    <template
      v-if="season"
      #actions
    >
      <PButton
        tag="router-link"
        :to="{name: 'adminDriversInSeason', params: {season: season.id}}"
        type="outline"
        color="info"
        icon="fa fa-user-group"
      >
        Pilotos
      </PButton>
      <PButton
        tag="router-link"
        :to="{name: 'adminConstructorsInSeason', params: {season: season.id}}"
        type="outline"
        color="info"
        icon="fa fa-screwdriver"
      >
        Constructores
      </PButton>
    </template>

    <p class="mb-4 text-gray-600 dark:text-gray-300">
      Copia a esta temporada los constructores y pilotos de otra. Lo que ya está en la temporada no se vuelve a copiar.
    </p>
    <SeasonGridImporter
      v-if="season"
      :target-season="season"
    />
  </PPage>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {seasonService} from "@/_services";
import {Season} from "@/types/Season";
import SeasonGridImporter from "@/components/admin/seasons/SeasonGridImporter.vue";
import PButton from "@/components/lib/forms/PButton.vue";

const route = useRoute();

const season = ref<Season>();
const isLoading = ref(true);

onMounted(async () => {
  try {
    season.value = await seasonService.getSeason(route.params.season as string);
  } catch {
    season.value = undefined;
  } finally {
    isLoading.value = false;
  }
});
</script>
