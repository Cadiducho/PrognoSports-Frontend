<template>
    <div id="createCompetition" class="box">
        <PrognoPageTitle class="mb-5" name="Crear competición" />

        <section v-if="isAdmin(currentUser.rank)">
            <b-steps v-model="activeStep">
                <b-step-item step="1" label="Datos de la competición">
                    <h2 class="title">Datos de la competición</h2>

                    <b-field label="Nombre de la competición">
                        <b-input v-model="createdCompetition.name" name="name" expanded lazy></b-input>
                    </b-field>

                    <b-field label="Nombre completo y con patrocinadores">
                        <b-input v-model="createdCompetition.fullname" name="fullname" expanded lazy></b-input>
                    </b-field>

                    <b-field label="Código de la competición">
                        <b-input v-model="createdCompetition.code" name="code" expanded lazy></b-input>
                    </b-field>

                    <b-field label="Reglas">
                        <b-input v-model="createdCompetition.rules" type="textarea" expanded lazy></b-input>
                    </b-field>

                    <hr/>

                </b-step-item>

                <b-step-item step="2" label="Finalizar">
                    <h2 class="title">Finalizar</h2>

                    <AlertInvalidData :object="createdCompetition.name" message="No has introducido nombre para esta competición" />
                    <AlertInvalidData :object="createdCompetition.code" message="No has introducido código para esta competición" />
                    <AlertInvalidData :object="createdCompetition.fullname" message="No has introducido nombre completo para esta competición" />
                    <AlertInvalidData :object="createdCompetition.rules" message="No has reglas para esta competición" />

                    <div class="notification has-background-primary">
                        Revisa los datos, se va a crear la siguiente competición
                    </div>

                    <div class="content">
                        <p class="card-text"><b>Nombre de la competición: </b>{{ createdCompetition.name }}</p>
                        <p class="card-text"><b>Nombre completo de la competición: </b>{{ createdCompetition.fullname }}</p>
                        <p class="card-text"><b>Code de la competición: </b>{{ createdCompetition.code }}</p>
                    </div>
                    <section class="content">
                        <div v-html="compiledRules"></div>
                    </section>

                    <hr/>
                    <b-field>
                        <p class="control">
                            <b-button :disabled="!isDataOk()" label="Crear competición" @click="registerCompetition()" type="is-primary" />
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
import {competitionService} from "@/_services";
import AlertInvalidData from "@/components/lib/AlertInvalidData.vue";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import {Competition} from "@/types/Competition";
import {marked} from "marked";
const Auth = namespace('Auth')

@Component({
        components: {
            AlertNoPermission,
            AlertInvalidData,
            PrognoPageTitle,
        }
    }
)
export default class SeasonCreate extends Vue {
    @Auth.State("user") private currentUser!: User;

    private activeStep = 0;

    private createdCompetition: Competition = {
        id: undefined!,
        code: undefined!,
        name: undefined!,
        fullname: undefined!,
        currentSeason: undefined!,
        rules: undefined!,
        availableSessions: []
    }

    get compiledRules() {
        return marked(this.createdCompetition?.rules ?? "");
    }

    private isDataOk(): boolean {
        return !(this.createdCompetition.id == undefined
            && this.createdCompetition.code == undefined
            && this.createdCompetition.name == undefined
            && this.createdCompetition.fullname == undefined
            && this.createdCompetition.rules == undefined)
    }

    private registerCompetition(): void {
        let data = {
            code: this.createdCompetition!.code,
            name: this.createdCompetition!.name,
            fullname: this.createdCompetition!.fullname,
            rules: this.createdCompetition!.rules,
        }

        competitionService.createCompetition(data).then((result) => {
            this.$buefy.toast.open({
                message: "Se ha registrado correctamente la competición `" + result.name + "`",
                type: "is-success",
            });

            this.$router.push({
                name: 'adminCompetitions'
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