<template>
  <div
    id="seasonEdit"
    class="box"
  >
    <PTitle
      class="mb-5"
      name="Administración de temporadas"
    />

    <loading v-if="isLoading" />
    <template v-else>
      <div class="block">
        <o-button
          variant="link"
          to="/admin/seasons"
          tag="router-link"
        >
          Lista de temporadas
        </o-button>
      </div>

      <p v-if="!season">
        La temporada {{ seasonId }} no ha sido encontrada
      </p>
      <template v-else>
        <h2 class="title">
          Temporada {{ season.name }}
        </h2>
        <div class="columns">
          <div class="column is-one-quarter">
            <h3 class="subtitle">
              Datos de la temporada
            </h3>

            <o-field label="Nombre de la temporada">
              <o-input
                v-model="season.name"
                name="name"
                expanded
                lazy
              />
            </o-field>

            <o-field label="Número de eventos">
              <o-input
                v-model="season.totalEvents"
                name="longitude"
                expanded
                lazy
                type="number"
                step="any"
              />
            </o-field>

            <o-field label="Competición">
              <o-select
                v-model="season.competition.id"
                placeholder="Selecciona una competición"
                expanded
              >
                <option
                  v-for="comp in competitions"
                  :key="comp.id"
                  :value="comp.id"
                >
                  {{ comp.name }} ({{ comp.code }}) - {{ comp.fullname }}
                </option>
              </o-select>
            </o-field>

            <o-field>
              <p class="control">
                <o-button
                  :disabled="!isDataOk()"
                  label="Editar temporada"
                  variant="primary"
                  @click="editSeason()"
                />
              </p>
            </o-field>
          </div>

          <div class="column">
            <router-link
              class="box notification is-link has-text-centered has-text-weight-bold"
              :to="{ name: 'adminGpsInSeason' }"
            >
              Grandes Premios en la temporada {{ season.name }}
            </router-link>
            <router-link
              class="box notification is-link has-text-centered has-text-weight-bold"
              to="/admin/competitions"
            >
              Equipos en la temporada {{ season.name }}
            </router-link>
            <router-link
              class="box notification is-link has-text-centered has-text-weight-bold"
              to="/admin/competitions"
            >
              Pilotos en la temporada {{ season.name }}
            </router-link>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { competitionService, notificationService, seasonService } from "@/_services";
import { Season } from "@/types/Season";
import { Competition } from "@/types/Competition";

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
