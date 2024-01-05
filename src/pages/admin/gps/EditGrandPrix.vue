<template>
    <div id="adminDrivers" class="box">

        <loading v-if="isLoadingGrandPrix"/>
        <template v-else>

            <PrognoPageTitle :name="'Administración de ' + grandPrix.name"/>

            <div class="block">
                <o-button variant="link" to="/admin/gps" tag="router-link">Lista de grandes premios</o-button>
            </div>

            <p v-if="!thereIsGrandPrix">El Gran Premio {{ id }} no ha sido encontrado</p>
            <template v-else>

                <div class="columns">
                    <div class="column">
                        <h2 class="title">Datos del {{ grandPrix.name }}</h2>

                        <o-field label="Nombre">
                            <o-input v-model="grandPrix.name" name="name" expanded lazy></o-input>
                        </o-field>


                        <o-field label="Código del Gran Premio">
                            <o-input v-model="grandPrix.code" name="code" expanded lazy></o-input>
                        </o-field>


                        <p class="control">
                            <o-button :disabled="!isDataOk()" label="Editar Gran Premio" @click="editGrandPrix()" variant="primary"/>
                        </p>
                    </div>
                </div>

            </template>
        </template>
    </div>

</template>

<script lang="ts">
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import {grandPrixService, notificationService} from "@/_services";
import {GrandPrix} from "@/types/GrandPrix";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import DriversInGrandPrix from "@/components/admin/gps/DriversInGrandPrix.vue";

export default defineComponent({
    name: "EditGrandPrix",
    components: {
        DriversInGrandPrix,
        PrognoPageTitle,
    },
    setup() {
        const authStore = useAuthStore();
        const currentUser = authStore.loggedUser;
        return {currentUser};
    },
    data() {
        return {
            id: this.$route.params.gp,

            grandPrix: {} as GrandPrix,
            thereIsGrandPrix: false,
            isLoadingGrandPrix: true,
        }
    },
    methods: {
        isDataOk(): boolean {
            return !(this.grandPrix.code.trim() === ""
                && this.grandPrix.name.trim() === ""
            )
        },
        editGrandPrix(): void {
            let data = {
                id: this.grandPrix!.id,
                name: this.grandPrix!.name,
                code: this.grandPrix!.code,
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
    },
    mounted() {
        grandPrixService.getGrandPrix(this.id)
            .then(gp => {
                this.grandPrix = gp;
                this.thereIsGrandPrix = true;
            }).finally(() => {
                this.isLoadingGrandPrix = false;
            }
        );
    }
});
</script>