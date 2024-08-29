<template>
  <PCard>
    <PTitle
      class="mb-5"
      name="Administración de pilotos"
    />

    <nav class="flex justify-between mb-4">
      <section class="flex flex-wrap">
        <p-button
          color="info"
          icon="fa fa-chevron-left"
          :to="{name: 'admin'}"
          tag="router-link"
          class="mr-2"
        >
          Volver a Administración
        </p-button>
        <p-button
          color="primary"
          icon="fa fa-plus"
          :to="{name: 'driverCreate'}"
          tag="router-link"
        >
          Nuevo Piloto
        </p-button>
      </section>
      <section class="flex flex-wrap">
        <p-button
          v-if="chosenSeason.id"
          color="info"
          icon="fa fa-cogs"
          :to="{name: 'adminGpsInSeason', params: {season: chosenSeason.id}}"
          tag="router-link"
          class="mr-2"
        >
          Ir a la temporda actual
        </p-button>
        <p-select
          v-if="seasonList"
          v-model="chosenSeason"
          placeholder="Selecciona la temporada"
          @change="goToSeason()"
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
      paginated
      has-view-button
      has-edit-button
      has-delete-button
      :with-filter="filteredDrivers"
      @view="goToView($event as Driver)"
      @edit="goToEdit($event as Driver)"
      @delete="confirmDeleteDriver($event as Driver)"
    />
    <PrognoModal
      v-show="isDeleteDriverModalActive"
      @close="isDeleteDriverModalActive = false"
      @handle="deleteDriver(driverToDelete!)"
    >
      <template #title>
        ¿Borrar Piloto?
      </template>
      <template #content>
        Estás seguro de que deseas borrar el Piloto <span class="has-text-weight-semibold">{{ driverToDelete.firstname }} {{ driverToDelete.lastname }} (ID {{ driverToDelete.id }})</span>?
      </template>
      <template #saveText>
        Borrar Piloto
      </template>
    </PrognoModal>
  </PCard>
</template>

<script setup lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import PCard from "@/components/lib/PCard.vue";
import PTable from "@/components/lib/table/PTable.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PSelect from "@/components/lib/forms/PSelect.vue";
import PrognoModal from "@/components/lib/PrognoModal.vue";
import {Driver} from "@/types/Driver";
import {Season} from "@/types/Season";
import {Column} from "@/components/lib/table";
import {driversService, seasonService, notificationService} from "@/_services";

import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();

const drivers = ref(new Array<Driver>());
const seasonList = ref(new Array<Season>());
const chosenSeason = ref<Season>({} as Season);
const driverToDelete = ref<Driver>({} as Driver);
const isDeleteDriverModalActive = ref(false);

const columns = ref<Column[]>([
  {label: 'ID', field: 'id'},
  {label: 'First Name', field: 'firstname'},
  {label: 'Last Name', field: 'lastname'},
  {label: 'Code', field: 'code'},
  {label: 'Nationality', field: 'nationality'},
  {label: 'Birth', field: 'birth', type: 'date'},
]);

const filteredDrivers = ((original: Driver[], filter: string): Driver[] => {
  console.log(original);

  return original.filter((driver) => {
    return (
      driver.id
        .toString()
        .includes(filter) ||
      driver.lastname
        .toLowerCase()
        .includes(filter) ||
      driver.firstname
        .toLowerCase()
        .includes(filter) ||
      driver.code
        .toLowerCase()
        .includes(filter) ||
      driver.nationality
        .toLowerCase()
        .includes(filter)
    );
  });
});

const goToView = (driver: Driver) => {
  router.push({name: 'driverDetails', params: {driver: driver.id}});
}

const goToEdit = (driver: Driver) => {
  router.push({name: 'driverEdit', params: {driver: driver.id}});
}

const goToSeason = () => {
  router.push({
    name: 'adminDriversInSeason',
    params: {
      season: chosenSeason.value.id,
    }
  });
}

const confirmDeleteDriver = (driver: Driver) => {
  driverToDelete.value = driver;
  isDeleteDriverModalActive.value = true;
}
const deleteDriver = (driver: Driver) => {
  isDeleteDriverModalActive.value = false;

  driversService.deleteDriver(driver).then(() => {
    notificationService.showNotification(`Se ha eliminado correctamente el piloto ${driver.firstname} ${driver.lastname}`, "success");
    drivers.value.splice(drivers.value.findIndex(d => d.id === driver.id), 1);
  }).catch(() => {
    notificationService.showNotification(`No se ha podido eliminar el piloto ${driver.firstname} ${driver.lastname}`, "error");
  });
}

onMounted(() => {
  driversService.getAllDrivers().then((response) => {
    drivers.value = [];
    drivers.value.push(...response);
  })
  seasonService.getSeasonList().then((response) => {
    seasonList.value = [];
    seasonList.value.push(...response);
    chosenSeason.value = seasonList.value[seasonList.value.length - 1];
  });
});
</script>
