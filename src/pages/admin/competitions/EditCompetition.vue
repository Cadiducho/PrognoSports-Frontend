<template>
  <div
    id="adminDrivers"
    class="box"
  >
    <PTitle
      class="mb-5"
      name="Administración de competiciones"
    />

    <loading v-if="isLoading" />
    <template v-else>
      <div class="block">
        <PButton
          color="info"
          to="/admin/competitions"
          tag="router-link"
          icon="fa fa-chevron-left"
        >
          Lista de competiciones
        </PButton>
      </div>

      <p v-if="!thereIsCompetition">
        La competición {{ competitionId }} no ha sido encontrada
      </p>
      <template v-else>
        <h2 class="title">
          Datos de la competición
        </h2>

        <PField label="Nombre de la competición">
          <PInput
            v-model="competition.name"
            name="name"
            expanded
            lazy
          />
        </PField>

        <PField label="Nombre completo y con patrocinadores">
          <PInput
            v-model="competition.fullname"
            name="fullname"
            expanded
            lazy
          />
        </PField>

        <PField label="Código de la competición">
          <PInput
            v-model="competition.code"
            name="code"
            expanded
            lazy
          />
        </PField>


        <PField label="Temporada actual">
          <PSelect
            v-model="competition.currentSeason.id"
            placeholder="Selecciona la temporada actual"
            expanded
          >
            <option
              v-for="season in compSeasons"
              :key="season.id"
              :value="season.id"
            >
              {{ season.name }} (#{{ season.id }})
            </option>
          </PSelect>
        </PField>

        <PField label="Reglas">
          <section class="flex gap-4">
            <div class="w-1/2">
              <PInput
                v-model="competition.rules"
                is-textarea
                :rows="60"
              />
            </div>
            <div class="w-1/2 content">
              <div v-html="previewRules" />
            </div>
          </section>
        </PField>

        <hr>
        <PButton
          :disabled="!isDataOk()"
          label="Editar competición"
          color="primary"
          @click="editCompetition()"
        />
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import {competitionService, notificationService} from "@/_services";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";
import {marked} from "marked";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import PButton from "@/components/lib/forms/PButton.vue";
import PField from "@/components/lib/forms/PField.vue";
import PSelect from "@/components/lib/forms/PSelect.vue";
import PInput from "@/components/lib/forms/PInput.vue";

export default defineComponent({
    name: "EditCompetition",
    components: {
      PInput,
      PSelect,
      PField,
      PButton,
        AlertNoPermission,
        PTitle,
    },
    setup() {
        const authStore = useAuthStore();

        const currentUser = authStore.loggedUser;
        return { currentUser };
    },
    data() {
        return {
            isLoading: true,
            thereIsCompetition: false,
            competition: {} as Competition,
            competitionId: this.$route.params.competition,
            compSeasons: new Array<Season>(),
        }
    },
    computed: {
        previewRules() {
            return marked(this.competition?.rules ?? "");
        }
    },
    mounted() {
        competitionService.getCompetition(this.competitionId).then((competition) => {
            this.competition = competition;
            this.thereIsCompetition = true;

            // Si no hay una temporada por defecto en la competición, pongo id 0 para poder renderizar el selector con v-model=currentSeason
            if (!this.competition.currentSeason) {
                this.competition.currentSeason = {id: 0} as Season
            }

            competitionService.getSeasonsOfCompetition(this.competition).then((ses) => {
                this.compSeasons = [];
                this.compSeasons.push(...ses);
            })
        }).finally(() => {
            this.isLoading = false;
        })
    },
    methods: {
        isDataOk(): boolean {
            return (this.competition !== undefined)
                && !(this.competition.id == undefined
                    && this.competition.code == undefined
                    && this.competition.name == undefined
                    && this.competition.rules == undefined
                    && this.competition.fullname == undefined)
        },
        editCompetition(): void {
            let data = {
                code: this.competition!.code,
                name: this.competition!.name,
                fullname: this.competition!.fullname,
                rules: this.competition!.rules,
                currentSeason: this.competition!.currentSeason!.id,
            }
            competitionService.editCompetition(this.competition!, data).then((result) => {
                notificationService.showNotification("Se ha editado correctamente la competición `" + result.name + "`", "success");

                this.$router.push({
                    name: 'adminCompetitions'
                })
            }).catch((error) => {
                notificationService.showNotification(error.message, "error");
            });
        }
    }
});
</script>
