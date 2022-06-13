<template>
    <div id="createDriver" class="box">
        <PrognoPageTitle class="mb-5" name="Crear piloto" />

        <section v-if="isAdmin(currentUser)">
            <o-steps v-model="activeStep">
                <o-step-item step="1" label="Datos del piloto">
                    <h2 class="title">Datos del piloto</h2>

                    <o-field label="ID del piloto">
                        <o-input v-model="createdDriver.id" name="id" expanded lazy></o-input>
                    </o-field>

                    <o-field label="Nombre del piloto">
                        <o-input v-model="createdDriver.firstname" name="firstname" expanded lazy></o-input>
                    </o-field>

                    <o-field label="Apellido del piloto">
                        <o-input v-model="createdDriver.lastname" name="lastname" expanded lazy></o-input>
                    </o-field>

                    <o-field label="Código del piloto">
                        <o-input v-model="createdDriver.code" name="code" expanded lazy></o-input>
                    </o-field>

                    <o-field label="Nacionalidad del piloto">
                        <o-input v-model="createdDriver.nationality" name="nationality" expanded lazy></o-input>
                    </o-field>

                    <o-field label="Fecha de nacimiento">
                        <o-datepicker
                            v-model="createdDriver.birth"
                            placeholder="Click para escoger..."
                            icon="calendar"
                            trap-focus>
                        </o-datepicker>
                    </o-field>

                    <hr/>

                </o-step-item>

                <o-step-item step="2" label="Finalizar">
                    <h2 class="title">Finalizar</h2>

                    <AlertInvalidData :object="createdDriver.id" message="No has introducido ID para este piloto" />
                    <AlertInvalidData :object="createdDriver.firstname" message="No has introducido nombre para este piloto" />
                    <AlertInvalidData :object="createdDriver.lastname" message="No has introducido apellido para este piloto" />
                    <AlertInvalidData :object="createdDriver.code" message="No has introducido código para este piloto" />
                    <AlertInvalidData :object="createdDriver.nationality" message="No has introducido nacionalidad para este piloto" />

                    <div class="notification has-background-primary">
                        Revisa los datos, se va a crear el siguiente piloto
                    </div>

                    <div class="content">
                        <p class="card-text"><b>ID del piloto: </b>{{ createdDriver.id }}</p>
                        <p class="card-text"><b>Nombre del piloto: </b>{{ createdDriver.firstname }} {{ createdDriver.lastname }}</p>
                        <p class="card-text"><b>Código del piloto: </b>{{ createdDriver.code }}</p>
                        <p class="card-text"><b>Nacionalidad del piloto: </b>{{ createdDriver.nationality }}</p>
                        <p class="card-text"><b>Fecha de nacimiento: </b>{{ createdDriver.birth | humanDate }}</p>
                    </div>

                    <hr/>
                    <o-field>
                        <p class="control">
                            <o-button :disabled="!isDataOk()" label="Crear piloto" @click="registerDriver()" variant="primary" />
                        </p>
                    </o-field>
                </o-step-item>
            </o-steps>
        </section>
        <section v-else>
            <AlertNoPermission />
        </section>
    </div>
</template>

<script lang="ts">
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import {driversService} from "@/_services";
import AlertInvalidData from "@/components/lib/AlertInvalidData.vue";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import {Driver} from "@/types/Driver";

import {defineComponent} from "vue";
import {useAuthStore} from "@/pinia/authStore";
import {useCommunityStore} from "@/pinia/communityStore";

export default defineComponent({
    name: "CreateDriver",
    components: {
        AlertNoPermission,
        AlertInvalidData,
        PrognoPageTitle,
    },
    setup() {
        const authStore = useAuthStore();

        const currentUser = authStore.user;
        return { currentUser };
    },
    data() {
        return {
            activeStep: 0,
            createdDriver: {
                id: undefined!,
                firstname: undefined!,
                lastname: undefined!,
                code: undefined!,
                nationality: undefined!,
                birth: undefined!,

                color: "",
                number: 0,
                team: undefined!
            } as Driver
        }
    },
    methods: {
        isDataOk(): boolean {
            return !(this.createdDriver.id == undefined && this.createdDriver.firstname == undefined && this.createdDriver.lastname == undefined
                && this.createdDriver.code == undefined && this.createdDriver.nationality == undefined && this.createdDriver.birth == undefined)
        },
        registerDriver(): void {
            let rawDriver = {
                id: this.createdDriver.id,
                firstname: this.createdDriver.firstname,
                lastname: this.createdDriver.lastname,
                code: this.createdDriver.code,
                nationality: this.createdDriver.nationality,
                birth: this.createdDriver.birth,
            }

            driversService.createDriver(rawDriver).then((result) => {
                this.$oruga.notification.open({
                    position: 'top',
                    message: "Se ha registrado correctamente el piloto `" + result.firstname + " " + result.lastname + "`",
                    variant: "success",
                });

                this.$router.push({
                    name: 'viewDriver',
                    params: {
                        id: result.id
                    }
                })
            }).catch((error) => {
                this.$oruga.notification.open({
                    position: 'top',
                    message: error.message,
                    variant: "danger",
                });
            });
        }
    }
});
</script>