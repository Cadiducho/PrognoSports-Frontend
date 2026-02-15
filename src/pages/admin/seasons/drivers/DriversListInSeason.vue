<template>
  <PCard>
    <PTitle
      v-if="chosenSeason?.name"
      class="mb-5"
      :name="'Administración de Pilotos en la temporada ' + chosenSeason.name"
    />

    <nav class="flex justify-between mb-4">
      <section class="flex flex-wrap">
        <p-button
          color="info"
          icon="fa fa-chevron-left"
          :to="{name: 'adminDrivers'}"
          tag="router-link"
          class="mr-2"
        >
          Volver a lista de Pilotos
        </p-button>
        <p-button
          color="primary"
          icon="fa fa-plus"
          :to="{name: 'adminSeasonAddDriver'}"
          tag="router-link"
        >
          Añadir Piloto a la temporada
        </p-button>
      </section>
      <section class="flex flex-wrap">
        <p-button
          color="info"
          icon="fa fa-cogs"
          :to="{name: 'adminSeasonEdit', params: {season: chosenSeason.id}}"
          tag="router-link"
          class="mr-2"
        >
          Administración de Temporada
        </p-button>
        <p-select
          v-if="seasonList"
          v-model="chosenSeason"
          placeholder="Selecciona la temporada"
          @change="onChangeSeason()"
        >
          <option
            v-for="ses in seasonList"
            :key="ses.id"
            :value="ses"
          >
            {{ ses.name }} (#{{ ses.id }}) - {{ ses.competition.name }}
          </option>
        </p-select>
      </section>
    </nav>

    <p-table
      :columns="columns"
      :rows="drivers"
      has-edit-button
      has-delete-button
      :with-filter="filteredDriver"
      @edit="goToEdit($event as Driver)"
      @delete="confirmDelete($event as Driver)"
    />

    <PrognoModal
      v-show="isDeleteModalActive"
      @close="isDeleteModalActive = false"
      @handle="deleteFromSeason(driverToDelete)"
    >
      <template #title>
        ¿Eliminar Piloto de esta competición?
      </template>
      <template #content>
        ¿Estás seguro de que quieres <b>eliminar</b> el Piloto
        <span class="has-text-weight-semibold">{{ driverToDelete.firstname }} {{ driverToDelete.lastname }}</span>
        de esta temporada? <br>Esta acción no se puede deshacer.
      </template>
      <template #saveText>
        Eliminar Piloto
      </template>
    </PrognoModal>
  </PCard>
</template>

<script setup lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import PTable from "@/components/lib/table/PTable.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PSelect from "@/components/lib/forms/PSelect.vue";
import PCard from "@/components/lib/PCard.vue";
import ColorBadge from "@/components/lib/table/formatters/ColorBadge.vue";
import {driversService, notificationService, seasonService} from "@/_services";
import { Season } from "@/types/Season";

import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import PrognoModal from "@/components/lib/PrognoModal.vue";
import {Driver} from "@/types/Driver";

const route = useRoute();
const router = useRouter();

const season = ref({ id: Number(route.params.season) } as Season);
const drivers = ref(new Array<Driver>());
const seasonList = ref(new Array<Season>());
const chosenSeason = ref({} as Season);
const isDeleteModalActive = ref(false);
const driverToDelete = ref({} as Driver);

const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Nombre', field: 'firstname' },
  { label: 'Apellido', field: 'lastname' },
  { label: 'Número', field: 'number' },
  { label: 'Color', field: 'color', formatter: ColorBadge },
];

onMounted(() => {
  loadDrivers(season.value);

  seasonService.getSeasonList().then((seasons) => {
    seasonList.value = [];
    seasonList.value.push(...seasons);
    chosenSeason.value = seasonList.value.find((s) => s.id === season.value.id)!;
  });
});

const loadDrivers = async (season: Season) => {
  const driverList = await driversService.getDriversInSeason(season)

  drivers.value = [];
  drivers.value.push(...driverList);
}
const onChangeSeason = () => {
  loadDrivers(chosenSeason.value!);
}

const goToEdit = (driver: Driver) => {
  router.push({name: 'adminSeasonEditDriver', params: {season: season.value.id, driver: driver.id}});
}

const confirmDelete = (driver: Driver) => {
  isDeleteModalActive.value = true;
  driverToDelete.value = driver;
}

const deleteFromSeason = (driver: Driver) => {
  try {
    driversService.deleteDriversInSeason(chosenSeason.value, driverToDelete.value)
    // Elimino de la lista y por lo tanto de la tabla
    drivers.value.splice(drivers.value.findIndex(d => d.id === driver.id), 1);

    notificationService.showNotification(`Se ha eliminado correctamente el piloto ${driver.firstname} ${driver.lastname} en la temporada #${chosenSeason.value.name}`, "success");
  } catch (error) {
    notificationService.showNotification("Ha ocurrido un error al eliminar el piloto de la temporada.", "error");
  }
  isDeleteModalActive.value = false;
}

const filteredDriver = ((original: Driver[], filter: string): Driver[] => {
  return original.filter(driver => {
    return (
      driver.id
        .toString()
        .includes(filter) ||
      driver.firstname
        .toLowerCase()
        .includes(filter) ||
      driver.lastname
        .toLowerCase()
        .includes(filter) ||
      driver.number
        .toString()
        .includes(filter)
    );
  });
});

</script>
