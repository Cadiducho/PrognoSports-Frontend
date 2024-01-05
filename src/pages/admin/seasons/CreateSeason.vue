<template>
    <div id="createSeason" class="box">
        <PrognoPageTitle class="mb-5" name="Crear temporada" />

        <o-steps v-model="activeStep">
            <o-step-item step="1" label="Datos de la temporada">
                <h2 class="title">Datos de la temporada</h2>

                <o-field label="Nombre de la temporada">
                    <o-input v-model="createdSeason.name" name="name" expanded lazy></o-input>
                </o-field>

                <o-field label="Número de eventos">
                    <o-input v-model="createdSeason.totalEvents" name="longitude" expanded lazy type="number" step="any"></o-input>
                </o-field>

                <o-field label="Competición">
                    <o-select v-model:class="createdSeason.competition" placeholder="Selecciona una competición" expanded>
                        <option
                            v-for="comp in competitions"
                            :value="comp"
                            :key="comp.id">
                            {{ comp.name }} ({{ comp.code }}) - {{ comp.fullname }}
                        </option>
                    </o-select>
                </o-field>

                <hr/>

            </o-step-item>

            <o-step-item step="2" label="Finalizar">
                <h2 class="title">Finalizar</h2>

                <AlertInvalidData :object="createdSeason.name" message="No has introducido nombre para esta temporada"/>
                <AlertInvalidData :object="createdSeason.totalEvents" message="No has introducido número de eventos para esta temporada"/>
                <AlertInvalidData :object="createdSeason.competition" message="No has introducido competición para esta temporada"/>

                <div class="notification has-background-primary">
                    Revisa los datos, se va a crear la siguiente temporada
                </div>

                <div class="content">
                    <p class="card-text"><b>Nombre de la temporada: </b>{{ createdSeason.name }}</p>
                    <p class="card-text"><b>Eventos de la temporada: </b>{{ createdSeason.totalEvents }}</p>
                    <p class="card-text" v-if="createdSeason.competition"><b>Competición: </b>{{ createdSeason.competition.name }}</p>
                </div>

                <hr/>
                <o-field>
                    <p class="control">
                        <o-button :disabled="!isDataOk()" label="Crear temporada" @click="registerSeason()" variant="primary"/>
                    </p>
                </o-field>
            </o-step-item>
        </o-steps>
    </div>
</template>

<script lang="ts">
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import {competitionService, notificationService, seasonService} from "@/_services";
import AlertInvalidData from "@/components/lib/AlertInvalidData.vue";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import {Season} from "@/types/Season";
import {Competition} from "@/types/Competition";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";

export default defineComponent({
    name: "CreateSeason",
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
            competitions: new Array<Competition>(),
            createdSeason: {
                id: undefined!,
                competition: undefined!,
                name: undefined!,
                totalEvents: undefined!
            } as Season
        }
    },
    mounted() {
        competitionService.getCompetitionList().then((list) => {
            this.competitions = [];
            this.competitions.push(...list);
        })
    },
    methods: {
        isDataOk(): boolean {
            return !(this.createdSeason.id == undefined && this.createdSeason.name == undefined && this.createdSeason.competition == undefined)
        },
        registerSeason(): void {
            let rawSeason = {
                name: this.createdSeason.name,
                totalEvents: this.createdSeason.totalEvents,
                competition: this.createdSeason.competition.name,
            }

            seasonService.createSeason(rawSeason).then((result) => {
                notificationService.showNotification("Se ha registrado correctamente la temporada `" + result.name + "`");

                this.$router.push({
                    name: 'adminSeasons'
                })
            }).catch((error) => {
                notificationService.showNotification(error.message, "error");
            });
        }
    },
});
</script>