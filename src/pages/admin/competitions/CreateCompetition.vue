<template>
    <div id="createCompetition" class="box">
        <PrognoPageTitle class="mb-5" name="Crear competición"/>

        <o-steps v-model="activeStep">
            <o-step-item step="1" label="Datos de la competición">
                <h2 class="title">Datos de la competición</h2>

                <o-field label="Nombre de la competición">
                    <o-input v-model="createdCompetition.name" name="name" expanded lazy></o-input>
                </o-field>

                <o-field label="Nombre completo y con patrocinadores">
                    <o-input v-model="createdCompetition.fullname" name="fullname" expanded lazy></o-input>
                </o-field>

                <o-field label="Código de la competición">
                    <o-input v-model="createdCompetition.code" name="code" expanded lazy></o-input>
                </o-field>

                <o-field label="Reglas">
                    <o-input v-model="createdCompetition.rules" type="textarea" expanded lazy></o-input>
                </o-field>

                <hr/>

            </o-step-item>

            <o-step-item step="2" label="Finalizar">
                <h2 class="title">Finalizar</h2>

                <AlertInvalidData :object="createdCompetition.name" message="No has introducido nombre para esta competición"/>
                <AlertInvalidData :object="createdCompetition.code" message="No has introducido código para esta competición"/>
                <AlertInvalidData :object="createdCompetition.fullname" message="No has introducido nombre completo para esta competición"/>
                <AlertInvalidData :object="createdCompetition.rules" message="No has reglas para esta competición"/>

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
                <o-field>
                    <p class="control">
                        <o-button :disabled="!isDataOk()" label="Crear competición" @click="registerCompetition()" variant="primary"/>
                    </p>
                </o-field>
            </o-step-item>
        </o-steps>
    </div>
</template>

<script lang="ts">
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import {competitionService, notificationService} from "@/_services";
import AlertInvalidData from "@/components/lib/AlertInvalidData.vue";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import {ICompetition} from "@/types/Competition";
import {marked} from "marked";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";

export default defineComponent({
    name: "CreateCompetition",

    components: {
        AlertNoPermission,
        AlertInvalidData,
        PrognoPageTitle,
    },
    setup() {
        const authStore = useAuthStore();

        const currentUser = authStore.loggedUser;
        return { currentUser };
    },
    data() {
        return {
            activeStep: 0,
            createdCompetition: {
                id: undefined!,
                code: undefined!,
                name: undefined!,
                fullname: undefined!,
                currentSeason: undefined!,
                rules: undefined!,
                availableSessions: []
            } as ICompetition,
        }
    },
    methods: {
        isDataOk(): boolean {
            return !(this.createdCompetition.id == undefined
                && this.createdCompetition.code == undefined
                && this.createdCompetition.name == undefined
                && this.createdCompetition.fullname == undefined
                && this.createdCompetition.rules == undefined)
        },
        registerCompetition(): void {
            let data = {
                code: this.createdCompetition!.code,
                name: this.createdCompetition!.name,
                fullname: this.createdCompetition!.fullname,
                rules: this.createdCompetition!.rules,
            }

            competitionService.createCompetition(data).then((result) => {
                notificationService.showNotification("Se ha registrado correctamente la competición `" + result.name + "`");

                this.$router.push({
                    name: 'adminCompetitions'
                })
            }).catch((error) => {
                notificationService.showNotification(error.message, "danger");
            });
        }
    },
    computed: {
        compiledRules() {
            return marked(this.createdCompetition?.rules ?? "");
        }
    }
});
</script>