<template>
    <div id="adminDrivers" class="box">

        <loading v-if="isLoadingGrandPrix"/>
        <template v-else-if="!thereIsGrandPrix">
            <p>El Gran Premio {{ id }} no ha sido encontrado</p>
        </template>
        <template v-else>

            <div class="columns is-variable is-5">
                <div class="column">
                    <PTitle :name="'Administración de ' + grandPrix.name + ' de ' + grandPrix.season.name"/>
                </div>
                <div class="column is-3">
                    <GrandPrixPagination isAdminPag :competition="grandPrix.competition" :grand-prix="grandPrix"/>
                </div>
            </div>

            <div class="block">
                <p-button tag="router-link" color="success" icon="fa fa-eye"
                          :to="{ name: 'gpdetails', params: {gp: grandPrix.id, season: grandPrix.season.name, competition: grandPrix.competition.code} }">
                    Ir al Gran Premio
                </p-button>
                <p-button tag="router-link" color="blue" icon="fa fa-list"
                          :to="{ name: 'adminGps' }">
                    Lista de grandes premios
                </p-button>
                <p-button tag="router-link" color="purple" icon="fa fa-cogs"
                          :to="{ name: 'adminSeasonEdit', params: {season: grandPrix.season.name} }">
                    Admin de temporada
                </p-button>

            </div>

                <div class="columns">
                    <div class="column is-one-fifth">
                        <SessionsInGrandPrix :grand-prix="grandPrix" :sessions="grandPrix.sessions"/>
                    </div>
                    <div class="column">
                        <h2 class="title">Datos del {{ grandPrix.name }}</h2>

                        <div class="columns">
                            <div class="column is-four-fifths">
                                <o-field label="Nombre">
                                    <o-input v-model="grandPrix.name" name="name" expanded lazy></o-input>
                                </o-field>
                            </div>
                            <div class="column">
                                <o-field label="Estado">
                                    <o-switch
                                        class="mt-2"
                                        v-model="grandPrix.suspended"
                                        variant="danger"
                                        passive-variant="primary">
                                        {{ grandPrix.suspended ? "Suspendido" : "Activo" }}
                                    </o-switch>
                                </o-field>
                            </div>
                        </div>

                        <div class="columns">
                            <div class="column">
                                <o-field label="Código del Gran Premio">
                                    <o-input v-model="grandPrix.code" name="code" expanded lazy></o-input>
                                </o-field>

                                <o-field label="Ronda del Gran Premio">
                                    <o-input v-model="grandPrix.round" name="round" expanded lazy :min=0 type="number"></o-input>
                                </o-field>

                                <button class="button is-primary mt-2" :disabled="!isDataOk()" @click="editGrandPrix()">Editar datos del gran premio</button>

                            </div>
                            <div class="column">
                                <o-field label="Circuito del Gran Premio">
                                    <o-select v-model="grandPrix.circuit" placeholder="Selecciona un circuito" expanded>
                                        <option
                                            v-for="circuit in circuitList"
                                            :value="circuit"
                                            :key="circuit.id">
                                            {{ circuit.name }}
                                        </option>
                                    </o-select>
                                </o-field>

                                <o-field label="Variante del circuito">
                                    <o-select v-model="grandPrix.variant" placeholder="Selecciona un circuito" expanded>
                                        <option
                                            v-for="variant in variantsList"
                                            :value="variant"
                                            :key="variant.name">
                                            {{ variant.name }}
                                        </option>
                                    </o-select>
                                </o-field>

                                <o-field label="Vueltas del Gran Premio">
                                    <o-input v-model="grandPrix.laps" name="laps" expanded lazy :min=0 type="number"></o-input>
                                </o-field>
                            </div>
                        </div>

                        <div class="columns">
                            <div class="column is-half">

                                <label class="label mt-2">Imagen promocional del Gran Premio</label>
                                <figure class="image is-16by9">
                                    <img :src="grandPrix.promoImage()" alt="Promo image"/>

                                    <label class="icon edit-icon">
                                        <i class="fa fa-camera"></i>
                                        <input @change="onFileChange" accept="image/*" tabindex="-1" type="file" hidden>
                                    </label>
                                </figure>
                            </div>
                        </div>

                    </div>
                </div>

                <hr/>

                <DriversInGrandPrix v-if="thereIsGrandPrix" :grand-prix="grandPrix"/>

        </template>
    </div>

    <UploadFileModal v-show="showEditImageModal" @close="showEditImageModal = false"
                     :stencilProps="{
                        aspectRatio: 16/9
                     }"
                     :canvas="{
                        maxWidth: 1080,
                        maxHeight: 1024
                     }"
                     :file="selectedFile" stencil-component="rectangle"
                     @submit-file="uploadPromoImage">
        <template v-slot:title>Cambiar imagen de promoción del Gran Premio</template>
    </UploadFileModal>

</template>

<script lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import {circuitService, grandPrixService, notificationService, seasonService, userService} from "@/_services";
import {Season} from "@/types/Season";
import {GrandPrix} from "@/types/GrandPrix";
import {Circuit} from "@/types/Circuit";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import SessionsInGrandPrix from "@/components/admin/gps/SessionsInGrandPrix.vue";
import DriversInGrandPrix from "@/components/admin/gps/DriversInGrandPrix.vue";
import GrandPrixPagination from "@/components/gps/GrandPrixPagination.vue";
import UploadFileModal from "@/components/lib/UploadFileModal.vue";
import {CircuitVariant} from "@/types/CircuitVariant";
import PButton from "@/components/lib/forms/PButton.vue";

export default defineComponent({
    name: "EditGrandPrixInSeason",
    components: {
        PButton,
        DriversInGrandPrix,
        AlertNoPermission,
        PTitle,
        SessionsInGrandPrix,
        GrandPrixPagination,
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
    }
});
</script>
<style>
.image.is-256x256 {
    height: 256px;
    width: 256px;
}
</style>