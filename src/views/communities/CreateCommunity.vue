<template>
    <div id="createCommunity" class="box">
        <PrognoPageTitle class="mb-5" name="Crear comunidad" />

        <section>
            <b-field horizontal label="Nombre" type="is-danger" message="Nombre de la comunidad">
                <b-input v-model="name" name="subject" expanded></b-input>
            </b-field>

            <b-field horizontal label="Descripción">
                <b-input v-model="description" type="textarea"></b-input>
            </b-field>

            <b-field horizontal label="Imagen" type="is-danger" message="Imagen para la comunidad (URL)">
                <b-input v-model="imageUrl" name="image" expanded></b-input>
            </b-field>

            <b-field horizontal label="Posiciones pronosticadas en clasificación">
                <b-numberinput v-model="numberQualify" min="3" max="20" controls-position="compact"></b-numberinput>
            </b-field>

            <b-field horizontal label="Posiciones pronosticadas en carrera">
                <b-numberinput v-model="numberRace" min="3" max="20" controls-position="compact"></b-numberinput>
            </b-field>

            <b-field horizontal label="Privacidad de la comunidad">
                <b-switch
                    v-model="privacy"
                    passive-type='is-success'
                    type='is-danger'>
                    {{ privacy ? "Cerrada" : "Abierta" }}
                </b-switch>
            </b-field>

            <b-field horizontal>
                <p class="control">
                    <b-button label="Registrar comunidad" @click="registerCommunity()" type="is-primary" />
                </p>
            </b-field>

        </section>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import {User} from "@/types/User";
import {namespace} from "vuex-class";
import {communityService} from "@/_services";
import {Community} from "@/types/Community";
import EventBus from "@/plugins/eventbus";
const Auth = namespace('Auth')

@Component({
        components: {
            PrognoPageTitle
        }
    }
)
export default class ViewCommunitiesList extends Vue {
    @Auth.State("user") private currentUser!: User;
    @Auth.Action setCommunity!: (community: Community) => void;

    private name: string = "";
    private description: string = "";
    private imageUrl: string = "";
    private numberQualify: number = 4;
    private numberRace: number = 10;
    private privacy: boolean = false;

    private registerCommunity() {
        let data = {
            name: this.name,
            description: this.description,
            image_url: this.imageUrl,
            qualify_positions_predicted: this.numberQualify,
            race_positions_predicted: this.numberRace,
            owner: this.currentUser.id,
            open: !this.privacy,
            default_rule_set: 1, //FixMe: Creador de rulesets
        };

        communityService.createCommunity(data).then((community) => {
            this.$buefy.toast.open({
                message: "Se ha registrado correctamente la comunidad `" + community.name + "`",
                type: "is-success",
            });

            this.$router.push({
                name: 'communitiesDetails',
                params:  {
                    community: community.name,
                }
            })
            // FixMe: Numeros de posiciones pronosticados

            this.setCommunity(community); // Establecer en Vuex la comunidad actual
            EventBus.$emit('reloadCommunitiesDropdown'); // Recargar dropdown del navbar
        }).catch((error) => {
            this.$buefy.toast.open({
                message: error,
                type: "is-danger",
            });
        })
    }
}
</script>