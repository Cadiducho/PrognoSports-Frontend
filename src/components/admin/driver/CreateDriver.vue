<template>
    <div id="createDriver" class="box">
        <PrognoPageTitle class="mb-5" name="Crear piloto" />

        <section v-if="isAdmin(currentUser)">
            <b-steps v-model="activeStep">
                <b-step-item step="1" label="Datos del piloto">
                    <h2 class="title">Datos del piloto</h2>

                    <b-field label="ID del piloto">
                        <b-input v-model="createdDriver.id" name="id" expanded lazy></b-input>
                    </b-field>

                    <b-field label="Nombre del piloto">
                        <b-input v-model="createdDriver.firstname" name="firstname" expanded lazy></b-input>
                    </b-field>

                    <b-field label="Apellido del piloto">
                        <b-input v-model="createdDriver.lastname" name="lastname" expanded lazy></b-input>
                    </b-field>

                    <b-field label="Código del piloto">
                        <b-input v-model="createdDriver.code" name="code" expanded lazy></b-input>
                    </b-field>

                    <b-field label="Nacionalidad del piloto">
                        <b-input v-model="createdDriver.nationality" name="nationality" expanded lazy></b-input>
                    </b-field>

                    <b-field label="Fecha de nacimiento">
                        <b-datepicker
                            v-model="createdDriver.birth"
                            placeholder="Click para escoger..."
                            icon="calendar"
                            trap-focus>
                        </b-datepicker>
                    </b-field>

                    <hr/>

                </b-step-item>

                <b-step-item step="2" label="Finalizar">
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
                    <b-field>
                        <p class="control">
                            <b-button :disabled="!isDataOk()" label="Crear piloto" @click="registerDriver()" type="is-primary" />
                        </p>
                    </b-field>
                </b-step-item>
            </b-steps>
        </section>
        <section v-else>
            <AlertNoPermission />
        </section>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import {User} from "@/types/User";
import {namespace} from "vuex-class";
import {driversService} from "@/_services";
import AlertInvalidData from "@/components/lib/AlertInvalidData.vue";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import {Driver} from "@/types/Driver";
const Auth = namespace('Auth')

@Component({
        components: {
            AlertNoPermission,
            AlertInvalidData,
            PrognoPageTitle,
        }
    }
)
export default class createDriver extends Vue {
    @Auth.State("user") private currentUser!: User;

    private activeStep = 0;

    private createdDriver: Driver = {
        id: undefined!,
        firstname: undefined!,
        lastname: undefined!,
        code: undefined!,
        nationality: undefined!,
        birth: undefined!,

        color: "",
        number: 0,
        team: undefined!
    }

    private isDataOk(): boolean {
        return !(this.createdDriver.id == undefined && this.createdDriver.firstname == undefined && this.createdDriver.lastname == undefined
                && this.createdDriver.code == undefined && this.createdDriver.nationality == undefined && this.createdDriver.birth == undefined)
    }

    private registerDriver(): void {
        let rawDriver = {
            id: this.createdDriver.id,
            firstname: this.createdDriver.firstname,
            lastname: this.createdDriver.lastname,
            code: this.createdDriver.code,
            nationality: this.createdDriver.nationality,
            birth: this.createdDriver.birth,
        }

        driversService.createDriver(rawDriver).then((result) => {
            this.$buefy.toast.open({
                message: "Se ha registrado correctamente el piloto `" + result.firstname + " " + result.lastname + "`",
                type: "is-success",
            });

            this.$router.push({
                name: 'viewDriver',
                params: {
                    id: result.id
                }
            })
        }).catch((error) => {
            this.$buefy.toast.open({
                message: error.message,
                type: "is-danger",
            });
        });
    }
}
</script>