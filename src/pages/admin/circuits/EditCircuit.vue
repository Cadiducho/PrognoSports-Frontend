<template>
    <div id="adminDrivers" class="box">
        <PrognoPageTitle class="mb-5" name="Administración de circuitos"/>

        <loading v-if="isLoading"/>
        <template v-else>

            <div class="block">
                <o-button variant="link" to="/admin/competitions" tag="router-link">Lista de circuitos</o-button>
            </div>

            <p v-if="!thereIsCircuit">El circuito {{ circuitId }} no ha sido encontrada</p>
            <template v-else>

                <h2 class="title">Datos del circuito</h2>

                <o-field label="Nombre del circuito">
                    <o-input v-model="circuit.name" name="name" expanded lazy></o-input>
                </o-field>

                <o-field label="Localidad del circuito">
                    <o-input v-model="circuit.locality" name="name" expanded lazy></o-input>
                </o-field>

                <o-field label="País del circuito">
                    <o-input v-model="circuit.country" name="name" expanded lazy></o-input>
                </o-field>

                <o-field label="Latitud del circuito">
                    <o-input v-model="circuit.latitude" name="name" expanded lazy></o-input>
                </o-field>

                <o-field label="Longitud del circuito">
                    <o-input v-model="circuit.longitude" name="name" expanded lazy></o-input>
                </o-field>

                Variantes:
                <ul>
                    <li v-for="variant in circuit.variants">
                        {{ variant.name }}
                    </li>
                </ul>

                <hr/>
                <o-field>
                    <p class="control">
                        <o-button :disabled="!isDataOk()" label="Editar circuito" @click="editCircuit()" variant="primary"/>
                    </p>
                </o-field>
            </template>
        </template>

    </div>
</template>

<script lang="ts">
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import {circuitService, notificationService} from "@/_services";
import {marked} from "marked";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import {Circuit} from "@/types/Circuit";

export default defineComponent({
    name: "EditCircuit",
    components: {
        AlertNoPermission,
        PrognoPageTitle,
    },
    setup() {
        const authStore = useAuthStore();

        const currentUser = authStore.loggedUser;
        return { currentUser };
    },
    data() {
        return {
            isLoading: true,
            thereIsCircuit: false,
            circuit: {} as Circuit,
            circuitId: this.$route.params.circuit,
        }
    },
    mounted() {
        circuitService.getCircuit(this.circuitId).then((circuit) => {
            this.circuit = circuit;
            this.thereIsCircuit = true;
        }).finally(() => {
            this.isLoading = false;
        })
    },
    methods: {
        isDataOk(): boolean {
            return (this.circuit !== undefined)
                && !(this.circuit.id == undefined)
        },
        editCircuit(): void {
            let data = {
                name: this.circuit!.name,
                locality: this.circuit!.locality,
                country: this.circuit!.country,
                latitude: this.circuit!.latitude,
                longitude: this.circuit!.longitude,
            }
            circuitService.editCircuit(this.circuit!, data).then((result) => {
                notificationService.showNotification("Se ha editado correctamente el circuito `" + result.name + "`");

                this.$router.push({
                    name: 'adminCircuits'
                })
            }).catch((error) => {
                notificationService.showNotification(error.message, "error");
            });
        }
    },
});
</script>