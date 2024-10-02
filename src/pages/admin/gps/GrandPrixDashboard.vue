<template>
  <PCard>
    <PTitle
      class="mb-5"
      name="Administración de Grandes Premios"
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
          :to="{name: 'gpCreate'}"
          tag="router-link"
        >
          Nuevo Gran Premio
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
      :rows="gps"
      paginated
      has-edit-button
      has-delete-button
      :with-filter="filteredGps"
      @edit="goToEdit($event as GrandPrix)"
      @delete="confirmDeleteGrandPrix($event as GrandPrix)"
    />
  </PCard>
  <PrognoModal
    v-show="isDeleteGrandPrixModalActive"
    @close="isDeleteGrandPrixModalActive = false"
    @handle="deleteGrandPrix(grandPrixToDelete)"
  >
    <template #title>
      ¿Borrar Gran Premio?
    </template>
    <template #content>
      Estás seguro de que deseas borrar el Gran Premio <span class="has-text-weight-semibold">{{ grandPrixToDelete.name }}</span>?
    </template>
    <template #saveText>
      Borrar Gran Premio
    </template>
  </PrognoModal>
</template>

<script lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import PCard from "@/components/lib/PCard.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PSelect from "@/components/lib/forms/PSelect.vue";
import PTable from "@/components/lib/table/PTable.vue";
import PrognoModal from "@/components/lib/PrognoModal.vue";
import {grandPrixService, notificationService, seasonService} from "@/_services";
import {GrandPrix} from "@/types/GrandPrix";

import {defineComponent} from "vue";
import {useRouter} from "vue-router";

import {Season} from "@/types/Season";

export default defineComponent({
    name: "GrandPrixDashboard",
    components: {
        PrognoModal,
        PTitle,
        PCard,
        PButton,
        PSelect,
        PTable
    },
    setup() {
      const router = useRouter();

      const goToView = (gp: GrandPrix) => {
        router.push({name: 'gpdetails', params: {season: gp.season.id, competition: gp.competition.id, gp: gp.id}});
      }

      const goToEdit = (gp: GrandPrix) => {
          router.push({name: 'adminGpEditInSeason', params: {gp: gp.id}});
      }

    const filteredGps = ((original: GrandPrix[], filter: string): GrandPrix[] => {
      return original.filter((gp) => {
        return (
          gp.id
            .toString()
            .includes(filter) ||
          gp.name
            .toLowerCase()
            .includes(filter) ||
          gp.code
            .toLowerCase()
            .includes(filter)
        );
      });
    });

    return { goToView, goToEdit, filteredGps };
  },
    data() {
        return {
            gps: new Array<GrandPrix>(),
            seasonList: new Array<Season>(),
            chosenSeason: {} as Season,

            isDeleteGrandPrixModalActive: false,
            grandPrixToDelete: {} as GrandPrix,

            columns: [
                {label: 'ID', field: 'id'},
                {label: 'Nombre', field: 'name'},
                {label: 'Código', field: 'code'},
            ],
        }
    },
    mounted() {
        grandPrixService.getAllGrandPrixes().then(gpsList => {
            this.gps = [];
            this.gps.push(...gpsList);
        });
        seasonService.getSeasonList().then((seasons) => {
            this.seasonList = [];
            this.seasonList.push(...seasons);
            this.chosenSeason = this.seasonList[this.seasonList.length - 1];
        });
    },
    methods: {
        goToSeason() {
            this.$router.push({
                name: 'adminGpsInSeason',
                params: {
                    season: this.chosenSeason.id,
                }
            });
        },
        confirmDeleteGrandPrix(gp: GrandPrix) {
            this.grandPrixToDelete = gp;
            this.isDeleteGrandPrixModalActive = true;
        },
        deleteGrandPrix(gp: GrandPrix) {
            this.isDeleteGrandPrixModalActive = false;

            grandPrixService.deleteGrandPrix(gp).then(() => {
                notificationService.showNotification(`Se ha eliminado correctamente el gran premio ${gp.name}`);
                this.gps.splice(this.gps.findIndex(s => s.id === gp.id), 1);
            }).catch(() => {
                notificationService.showNotification(`No se ha podido eliminar el gran premio ${gp.name}`, "error");
            });
        }
    }
});
</script>
