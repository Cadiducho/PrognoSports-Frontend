<template>
  <nav
    id="adminDrivers"
    class="box"
  >
    <loading v-if="isLoadingGrandPrix" />
    <template v-else-if="!thereIsGrandPrix">
      <p>El Gran Premio {{ id }} no ha sido encontrado</p>
    </template>
    <template v-else>
      <GrandPrixPageHeader
        :grand-prix="grandPrix"
        :competition="grandPrix.competition"
        :is-admin="true"
      />

      <nav class="flex my-4">
        <p-button
          tag="router-link"
          color="success"
          icon="fa fa-eye"
          class="mr-2"
          :to="{ name: 'gpdetails', params: {gp: grandPrix.id, season: grandPrix.season.name, competition: grandPrix.competition.code} }"
        >
          Ir al Gran Premio
        </p-button>
        <p-button
          tag="router-link"
          color="blue"
          icon="fa fa-list"
          class="mr-2"
          :to="{ name: 'adminGps' }"
        >
          Lista de grandes premios
        </p-button>
        <p-button
          tag="router-link"
          color="purple"
          icon="fa fa-cogs"
          class="mr-2"
          :to="{ name: 'adminSeasonEdit', params: {season: grandPrix.season.name} }"
        >
          Admin de temporada
        </p-button>
      </nav>

      <div class="columns">
        <div class="column is-one-fifth">
          <SessionsInGrandPrix
            :grand-prix="grandPrix"
            :sessions="grandPrix.sessions"
          />
        </div>
        <div class="column">
          <h2 class="title">
            Datos del {{ grandPrix.name }}
          </h2>

          <div class="columns">
            <div class="column is-four-fifths">
              <PField label="Nombre">
                <PInput
                  v-model="grandPrix.name"
                  name="name"
                  expanded
                  lazy
                />
              </PField>
            </div>
            <div class="column">
              <PField label="Estado">
                <PSwitch
                  v-model="grandPrix.suspended"
                  class="mt-2"
                  variant="danger"
                  passive-variant="primary"
                >
                  {{ grandPrix.suspended ? "Suspendido" : "Activo" }}
                </PSwitch>
              </PField>
            </div>
          </div>

          <div class="columns">
            <div class="column">
              <PField label="Código del Gran Premio">
                <PInput
                  v-model="grandPrix.code"
                  name="code"
                />
              </PField>

              <PField label="Ronda del Gran Premio">
                <PInput
                  v-model="grandPrix.round"
                  name="round"
                  :min="0"
                  type="number"
                />
              </PField>

              <PButton
                class="mt-2"
                :disabled="!isDataOk()"
                @click="editGrandPrix()"
              >
                Editar datos del gran premio
              </PButton>
            </div>
            <div class="column">
              <PField label="Circuito del Gran Premio">
                <PSelect
                  v-model="grandPrix.circuit"
                  placeholder="Selecciona un circuito"
                  expanded
                >
                  <option
                    v-for="circuit in circuitList"
                    :key="circuit.id"
                    :value="circuit"
                  >
                    {{ circuit.name }}
                  </option>
                </PSelect>
              </PField>

              <PField label="Variante del circuito">
                <PSelect
                  v-model="grandPrix.variant"
                  placeholder="Selecciona un circuito"
                  expanded
                >
                  <option
                    v-for="variant in variantsList"
                    :key="variant.name"
                    :value="variant"
                  >
                    {{ variant.name }}
                  </option>
                </PSelect>
              </PField>

              <PField label="Vueltas del Gran Premio">
                <PInput
                  v-model="grandPrix.laps"
                  name="laps"
                  :min="0"
                  type="number"
                />
              </PField>
            </div>
          </div>

          <div class="columns">
            <div class="column is-half">
              <label class="label mt-2">Imagen promocional del Gran Premio</label>
              <figure class="image is-16by9">
                <img
                  :src="grandPrix.promoImage()"
                  alt="Promo image"
                >

                <label class="icon edit-icon">
                  <i class="fa fa-camera" />
                  <input
                    accept="image/*"
                    tabindex="-1"
                    type="file"
                    hidden
                    @change="onFileChange"
                  >
                </label>
              </figure>
            </div>
          </div>
        </div>
      </div>

      <hr>

      <DriversInGrandPrix
        v-if="thereIsGrandPrix"
        :grand-prix="grandPrix"
      />
    </template>

    <UploadFileModal
      v-show="showEditImageModal"
      :stencil-props="{
        aspectRatio: 16/9
      }"
      :canvas="{
        maxWidth: 1080,
        maxHeight: 1024
      }"
      :file="selectedFile"
      stencil-component="rectangle"
      @close="showEditImageModal = false"
      @submit-file="uploadPromoImage"
    >
      <template #title>
        Cambiar imagen de promoción del Gran Premio
      </template>
    </UploadFileModal>
  </nav>
</template>

<script lang="ts">
import {circuitService, grandPrixService, notificationService, seasonService} from "@/_services";
import {Season} from "@/types/Season";
import {GrandPrix} from "@/types/GrandPrix";
import {Circuit} from "@/types/Circuit";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import SessionsInGrandPrix from "@/components/admin/gps/SessionsInGrandPrix.vue";
import DriversInGrandPrix from "@/components/admin/gps/DriversInGrandPrix.vue";
import UploadFileModal from "@/components/lib/UploadFileModal.vue";
import {CircuitVariant} from "@/types/CircuitVariant";
import PButton from "@/components/lib/forms/PButton.vue";
import GrandPrixPageHeader from "@/components/gps/GrandPrixPageHeader.vue";
import PField from "@/components/lib/forms/PField.vue";
import PSelect from "@/components/lib/forms/PSelect.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import PSwitch from "@/components/lib/forms/PSwitch.vue";

export default defineComponent({
  name: "EditGrandPrixInSeason",
  components: {
    PSwitch,
    PInput,
    PSelect,
    PField,
    GrandPrixPageHeader,
    PButton,
    DriversInGrandPrix,
    SessionsInGrandPrix,
    UploadFileModal
  },
  setup() {
    const authStore = useAuthStore();
    const currentUser = authStore.loggedUser;
    return {currentUser};
  },
  data() {
    return {
      season: {name: this.$route.params.season} as Season,
      id: this.$route.params.gp,

      grandPrix: {} as GrandPrix,
      thereIsGrandPrix: false,
      isLoadingGrandPrix: true,

      showEditImageModal: false,
      selectedFile: null,

      circuitList: new Array<Circuit>(),
      seasonList: new Array<Season>(),
    }
  },
  computed: {
    variantsList(): Array<CircuitVariant> {
      return this.grandPrix.circuit?.variants ?? [];
    }
  },
  mounted() {
    grandPrixService.getGrandPrixInSeason(this.season, this.id.toString())
      .then(gp => {
        this.grandPrix = gp;
        this.thereIsGrandPrix = true;

        circuitService.getCircuitList().then((list) => {
          this.circuitList = [];
          this.circuitList.push(...list);
        });
        seasonService.getSeasonList().then((list) => {
          this.seasonList = [];
          this.seasonList.push(...list);
        });

        this.season = gp.season;
      }).catch((error) => {
      notificationService.showNotification("No se ha encontrado el gran premio", "error");
      console.log(error)
    }).finally(() => {
      this.isLoadingGrandPrix = false;
    });
  },
  methods: {
    isDataOk(): boolean {
      return !(this.grandPrix!.id == undefined
        && this.grandPrix!.code == undefined
        && this.grandPrix!.name == undefined
        && this.grandPrix!.circuit!.id == undefined
        && this.grandPrix!.laps == undefined
        && this.grandPrix!.round == undefined
        && this.grandPrix!.season!.id == undefined
      )
    },
    editGrandPrix(): void {
      let data = {
        id: this.grandPrix!.id,
        season: this.season.id,
        round: this.grandPrix!.round,
        name: this.grandPrix!.name,
        code: this.grandPrix!.code,
        circuit: this.grandPrix!.circuit.id,
        variant: this.grandPrix!.circuit.variant.name,
        laps: this.grandPrix!.laps,
        suspended: this.grandPrix!.suspended
      };

      grandPrixService.editGrandPrix(data).then((result) => {
        notificationService.showNotification("Se ha editado correctamente el gran premio `" + result.name + "`", "error");

        this.$router.push({
          name: 'adminGps'
        })
      }).catch((error) => {
        notificationService.showNotification(error.message, "error");
      });
    },
    onFileChange(e: any) {
      this.showEditImageModal = false;
      this.selectedFile = null;

      let file = e.target.files[0];
      if (file) {
        this.selectedFile = file;
        this.showEditImageModal = true;
      }
    },
    uploadPromoImage(blob: Blob) {
      grandPrixService.changePromoImage(this.grandPrix, blob).then(() => {
        notificationService.showNotification("Has cambiado la imagen de promoción");
      }).catch(() => {
        notificationService.showNotification("Ha ocurrido un error cambiando la imagen de promoción", "error");
      });
    }
  }
});
</script>

<style>
.image.is-256x256 {
  height: 256px;
  width: 256px;
}
</style>
