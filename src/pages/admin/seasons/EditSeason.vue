<template>
  <PCard id="seasonEdit">
    <loading v-if="isLoading" />
    <template v-else>

      <PTitle v-if="season" :name="`Administración de temporada ${season.name}`" />

      <nav class="flex justify-between mb-4">
        <section class="flex flex-wrap">
          <p-button
            color="info"
            icon="fa fa-chevron-left"
            :to="{name: 'adminSeasons'}"
            tag="router-link"
            class="mr-2"
          >
            Volver listado de Temporadas
          </p-button>
        </section>
      </nav>

      <p v-if="!season">
        La temporada {{ seasonId }} no ha sido encontrada
      </p>
      <template v-else>
        <PTitle type="subtitle" tag="h2" class="mb-2">
          Edición de Temporada {{ season.name }}
        </PTitle>

        <div class="flex flex-wrap justify-between gap-2">
          <section class="w-full xl:w-2/3 px-2 flex flex-col -mx-4 gap-4">
            <p-button
              color="info"
              icon="fa fa-list"
              size="large"
              :to="{name: 'adminGpsInSeason'}"
              tag="router-link"
              class="mr-2"
            >
              Grandes Premios en la temporada {{ season.name }}
            </p-button>
            <p-button
              color="info"
              icon="fa fa-screwdriver"
              size="large"
              :to="{name: 'adminConstructorsInSeason'}"
              tag="router-link"
              class="mr-2"
            >
              Constructores en la temporada {{ season.name }}
            </p-button>
            <!--<p-button
              color="info"
              icon="fa fa-user-group"
              size="large"
              :to="{name: 'adminDriversInSeason'}"
              tag="router-link"
              class="mr-2"
            >
              Pilotos en la temporada {{ season.name }}
            </p-button>-->
          </section>
          <section class="w-full xl:w-1/3 px-2">
            <p-input label="Nombre de la temporada" name="name" v-model="season.name" />
            <p-input label="Número de eventos" name="totalEvents" type="number" v-model="season.totalEvents" />

            <p-select
              v-if="competitions"
              label="Competición de la temporada"
              v-model="season.competition.id"
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

            <PButton
              expanded
              variant="primary"
              label="Editar temporada"
              class="mt-4"
              :disabled="!isDataOk()"
              @click="editSeason()"
            />
          </section>
        </div>
      </template>
    </template>
  </PCard>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { competitionService, notificationService, seasonService } from "@/_services";
import { Season } from "@/types/Season";
import { Competition } from "@/types/Competition";
import PCard from "@/components/lib/PCard.vue";
import PTitle from "@/components/lib/PTitle.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PSelect from "@/components/lib/forms/PSelect.vue";
import PInput from "@/components/lib/forms/PInput.vue";

const route = useRoute();
const router = useRouter();

const seasonId = route.params.season;
const isLoading = ref(true);
const season = ref<Season>();
const competitions = ref<Competition[]>([]);

onMounted(() => {
  seasonService.getSeason(seasonId.toString()).then((fetchedSeason) => {
    season.value = fetchedSeason;
  }).finally(() => {
    isLoading.value = false;
  })

  competitionService.getCompetitionList().then((list) => {
    competitions.value = [];
    competitions.value.push(...list);
  })
})

const isDataOk = (): boolean => {
  return season.value?.id !== undefined && season.value?.name !== undefined && season.value?.competition?.id !== undefined;
}
const editSeason = () => {
  const data = {
    competition: season.value!.competition.id,
    name: season.value!.name,
    totalEvents: season.value!.totalEvents
  }
  seasonService.editSeason(season.value!, data).then((result) => {
    notificationService.showNotification("Se ha editado correctamente la temporada `" + result.name + "`");

    router.push({
      name: 'adminSeasons'
    })
  }).catch((error) => {
    notificationService.showNotification(error.message, "error");
  });
}
</script>
