<template>
    <div id="createCommunity" class="box">
        <PrognoPageTitle class="mb-5" name="Crear circuito" />

        <section v-if="isAdmin(currentUser)">
            <b-steps v-model="activeStep">
                <b-step-item step="1" label="Datos del circuito">
                    <h2 class="title">Datos del circuito</h2>

                    <b-field label="ID" message="ID del circuito">
                        <b-input v-model="createdCircuit.id" name="id" expanded lazy></b-input>
                    </b-field>

                    <b-field label="Nombre" message="Nombre del circuito">
                        <b-input v-model="createdCircuit.name" name="name" expanded lazy></b-input>
                    </b-field>

                    <b-field label="País" message="País del circuito">
                        <b-input v-model="createdCircuit.country" name="country" expanded lazy></b-input>
                    </b-field>

                    <b-field label="Localidad" message="Localidad del circuito">
                        <b-input v-model="createdCircuit.locality" name="locality" expanded lazy></b-input>
                    </b-field>

                    <div class="columns">
                        <div class="column">
                            <b-field label="Latitud">
                                <b-input v-model="createdCircuit.latitude" name="latitude" expanded lazy type="number" step="any"></b-input>
                            </b-field>
                        </div>
                        <div class="column">
                            <b-field label="Longitud">
                                <b-input v-model="createdCircuit.longitude" name="longitude" expanded lazy type="number" step="any"></b-input>
                            </b-field>
                        </div>
                    </div>

                    <b-field label="URL del Logo">
                        <b-input v-model="createdCircuit.logo_url" name="logoUrl" expanded lazy></b-input>
                    </b-field>

                    <h2 class="title">Detalles de la variante</h2>

                    <b-field label="URL del Layout">
                        <b-input v-model="createdCircuit.variant.layout_image" name="layoutImage" expanded lazy></b-input>
                    </b-field>

                    <div class="columns">
                        <div class="column">
                            <b-field label="Distancia">
                                <b-input v-model="createdCircuit.variant.distance" name="distance" expanded lazy :min=0 type="number" step="any"></b-input>
                            </b-field>
                        </div>
                        <div class="column">
                            <b-field label="Curvas">
                                <b-input v-model="createdCircuit.variant.turns" name="turns" expanded lazy :min=0 type="number"></b-input>
                            </b-field>
                        </div>
                    </div>

                    <hr/>

                </b-step-item>

                <b-step-item step="2" label="Finalizar">
                    <h2 class="title">Finalizar</h2>

                    <AlertInvalidData :object="createdCircuit.id" message="No has introducido id del circuito" />
                    <AlertInvalidData :object="createdCircuit.name" message="No has introducido nombre del circuito" />
                    <AlertInvalidData :object="createdCircuit.country" message="No has introducido país del circuito" />
                    <AlertInvalidData :object="createdCircuit.locality" message="No has introducido localidad del circuito" />
                    <AlertInvalidData :object="createdCircuit.latitude" message="No has introducido latitud del circuito" />
                    <AlertInvalidData :object="createdCircuit.longitude" message="No has introducido longitud del circuito" />
                    <AlertInvalidData :object="createdCircuit.variant.distance" message="No has introducido distancia del circuito" />
                    <AlertInvalidData :object="createdCircuit.variant.turns" message="No has introducido curvas del circuito" />
                    <AlertInvalidData :object="createdCircuit.variant.layout_image" message="No has introducido plano del circuito" />

                    <div class="notification has-background-primary">
                        Revisa los datos, se va a crear la siguiente circuito
                    </div>

                    <ViewCircuitItem :circuit="createdCircuit" />

                    <hr/>
                    <b-field>
                        <p class="control">
                            <b-button :disabled="!isDataOk()" label="Crear circuito" @click="registerCircuit()" type="is-primary" />
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
import {circuitService} from "@/_services";
import ViewCircuitItem from "@/components/circuits/ViewCircuitItem.vue";
import {ICircuit} from "@/types/Circuit";
import AlertInvalidData from "@/components/lib/AlertInvalidData.vue";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
const Auth = namespace('Auth')

@Component({
        components: {
            AlertNoPermission,
            AlertInvalidData,
            ViewCircuitItem,
            PrognoPageTitle,
        }
    }
)
export default class CreateCircuit extends Vue {
    @Auth.State("user") private currentUser!: User;

    private activeStep = 0;

    private createdCircuit: ICircuit = {
        country: undefined!,
        id: undefined!,
        latitude: undefined!,
        locality: undefined!,
        logo_url: undefined!,
        longitude: undefined!,
        name: undefined!,
        variant: {
            name: "grandprix",
            distance: undefined!,
            turns: undefined!,
            layout_image: undefined!,
        }
    }

    private isDataOk(): boolean {
        return !(this.createdCircuit.id == undefined && this.createdCircuit.name == undefined && this.createdCircuit.country == undefined && this.createdCircuit.locality == undefined
            && this.createdCircuit.latitude == undefined && this.createdCircuit.longitude == undefined
            && this.createdCircuit.variant.layout_image == undefined
            && this.createdCircuit.variant.distance == undefined && this.createdCircuit.variant.turns == undefined)
    }

    private registerCircuit(): void {
        let rawCircuit = {
            id: this.createdCircuit.id,
            name: this.createdCircuit.name,
            country: this.createdCircuit.country,
            locality: this.createdCircuit.locality,
            latitude: this.createdCircuit.latitude,
            longitude: this.createdCircuit.longitude,
            logo_url: this.createdCircuit.logo_url,
            layout_image: this.createdCircuit.variant.layout_image,
            distance: this.createdCircuit.variant.distance,
            turns: this.createdCircuit.variant.turns,
        }

        // Se envia el circuito, con los datos por defecto para una variante GP que la API también creará
        circuitService.createCircuit(rawCircuit).then((result) => {
            this.$buefy.toast.open({
                message: "Se ha registrado correctamente el circuito `" + result.name + "`",
                type: "is-success",
            });

            this.$router.push({
                name: 'circuitDetails',
                params: {
                    circuit: result.id,
                    variant: result.variant.name
                }
            })
        }).catch((error) => {
            if (error.code === 705)  {
                this.$buefy.toast.open({
                    message: "Invalid data for this new circuit",
                    type: "is-danger",
                });
            } else {
                this.$buefy.toast.open({
                    message: error.message,
                    type: "is-danger",
                });
            }
        });

    }
}
</script>