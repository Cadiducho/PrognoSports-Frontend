<template>
  <PCard
    id="createCommunity"
  >
    <PTitle
      class="mb-5"
      name="Crear comunidad"
    />

    <nav class="block">
      <PButton
        color="info"
        :to="{name: 'adminGps'}"
        tag="router-link"
        icon="fa fa-chevron-left"
      >
        Volver a Comunidades
      </PButton>
    </nav>

    <section>
      <PStepper v-model="activeStep" :steps="[{ label: 'Descripción' }, { label: 'Reglas' }, { label: 'Finalizar' }]">
        <template #step-0>
          <h1 class="ui-title ui-text-center">
            Descripción
          </h1>

          <PField
            label="Nombre"
            message="Nombre de la comunidad"
          >
            <PInput
              v-model="name"
              name="subject"
            />
          </PField>

          <PField label="Descripción">
            <PInput
              v-model="description"
              type="textarea"
            />
          </PField>

          <PField
            label="Imagen"
            message="Imagen para la comunidad (URL)"
          >
            <PInput
              v-model="imageUrl"
              name="image"
            />
          </PField>

          <hr>

          <p class="block">
            Con una comunidad cerrada sólo se podrán unir miembros que dispongan del enlace de invitación. <br>
            Cualquiera podrá acceder a una comunidad abierta.
          </p>
          <PField label="Privacidad de la comunidad">
            <PSwitch
              v-model="privacy"
              color="danger"
              inactive-color="success"
            >
              {{ privacy ? "Cerrada" : "Abierta" }}
            </PSwitch>
          </PField>
        </template>

        <template #step-1>
          <h1 class="ui-title ui-text-center">
            Reglas
          </h1>

          <!-- FixMe: al creador de rulesets -->
          <div class="ui-grid">
            <div class="ui-column">
              <PField label="Posiciones pronosticadas en clasificación">
                <PRangeInput
                  v-model="numberQualify"
                  :min="3"
                  :max="20"
                  ticks
                />
              </PField>
            </div>
            <div class="ui-column">
              <PField label="Posiciones pronosticadas en carrera">
                <PRangeInput
                  v-model="numberRace"
                  :min="3"
                  :max="20"
                  ticks
                />
              </PField>
            </div>
          </div>

          <h1 class="ui-title ui-text-center">
            Puntuaciones
          </h1>

          <h2 class="ui-subtitle mb-0">
            Descripción del conjunto de reglas
          </h2>
          <p class="ui-content">
            Un conjunto de reglas podrá ser utilizado por otra comunidad, o podrás usar otros diferentes en cada carrera. Conviene poner un nombre y descripción
          </p>
          <PField label="Nombre del conjunto de reglas">
            <PInput
              v-model="rulesetName"
              name="subject"
            />
          </PField>
          <PField label="Descripción de las reglas">
            <PInput
              v-model="rulesetDescription"
              type="textarea"
            />
          </PField>

          <h2 class="ui-subtitle mb-0">
            Puntos por acertar la posición
          </h2>
          <div class="ui-grid">
            <div class="ui-column">
              <p class="ui-content italic">
                Posiciones de clasificación
              </p>
              <template v-for="pos in numberQualify" :key="`qualify-${pos}`">
                <PField :label="pos + 'º puesto de Clasificación'">
                  <PNumberInput v-model="pointsByEqualsPosition.QUALIFY[pos]" />
                </PField>
              </template>
            </div>

            <div class="ui-column">
              <p class="ui-content italic">
                Posiciones de carrera
              </p>
              <template v-for="pos in numberRace" :key="`race-${pos}`">
                <PField :label="pos + 'º puesto de Carrera'">
                  <PNumberInput v-model="pointsByEqualsPosition.RACE[pos]" />
                </PField>
              </template>
            </div>
          </div>
          <hr>


          <h2 class="ui-subtitle mb-0">
            Puntos por posición siguiente
          </h2>
          <p class="ui-content italic">
            Ejemplo: Pronostica un piloto en la 7ª posición, pero el resultado de este piloto es la 6ª
          </p>
          <div class="ui-grid">
            <div class="ui-column">
              <PField label="Clasificación">
                <PNumberInput v-model="pointsByNextPosition.QUALIFY" />
              </PField>
            </div>
            <div class="ui-column">
              <PField label="Carrera">
                <PNumberInput v-model="pointsByNextPosition.RACE" />
              </PField>
            </div>
          </div>
          <hr>

          <h2 class="ui-subtitle mb-0">
            Puntos por posición siguiente de la siguiente
          </h2>
          <p class="ui-content italic">
            Ejemplo: Pronostica un piloto en la 7ª posición, pero el resultado de este piloto es la 5ª
          </p>
          <div class="ui-grid">
            <div class="ui-column">
              <PField label="Clasificación">
                <PNumberInput v-model="pointsByNextOfFollowingPosition.QUALIFY" />
              </PField>
            </div>
            <div class="ui-column">
              <PField label="Carrera">
                <PNumberInput v-model="pointsByNextOfFollowingPosition.RACE" />
              </PField>
            </div>
          </div>
          <hr>

          <h2 class="ui-subtitle mb-0">
            Puntos por posición anterior
          </h2>
          <p class="ui-content italic">
            Ejemplo: Pronostica un piloto en la 3ª posición, pero el resultado de este piloto es la 4ª
          </p>
          <div class="ui-grid">
            <div class="ui-column">
              <PField label="Clasificación">
                <PNumberInput v-model="pointsByPreviousPosition.QUALIFY" />
              </PField>
            </div>
            <div class="ui-column">
              <PField label="Carrera">
                <PNumberInput v-model="pointsByPreviousPosition.RACE" />
              </PField>
            </div>
          </div>
          <hr>

          <h2 class="ui-subtitle mb-0">
            Puntos por posición anterior de la anterior
          </h2>
          <p class="ui-content italic">
            Ejemplo: Pronostica un piloto en la 3ª posición, pero el resultado de este piloto es la 5ª
          </p>
          <div class="ui-grid">
            <div class="ui-column">
              <PField label="Clasificación">
                <PNumberInput v-model="pointsByPreviousOfPreviousPosition.QUALIFY" />
              </PField>
            </div>
            <div class="ui-column">
              <PField label="Carrera">
                <PNumberInput v-model="pointsByPreviousOfPreviousPosition.RACE" />
              </PField>
            </div>
          </div>
          <hr>

          <h2 class="ui-subtitle mb-0">
            Puntos por pronosticar a alguien en podio y fallar
          </h2>
          <p class="ui-content italic">
            Ejemplo: Pronostica un piloto en la 2ª posición, pero el resultado de este piloto es la 8ª (fuera del podio)
          </p>
          <div class="ui-grid">
            <div class="ui-column">
              <PField label="Clasificación">
                <PNumberInput v-model="pointsIfIsNotInPodium.QUALIFY" />
              </PField>
            </div>
            <div class="ui-column">
              <PField label="Carrera">
                <PNumberInput v-model="pointsIfIsNotInPodium.RACE" />
              </PField>
            </div>
          </div>
          <hr>

          <h2 class="ui-subtitle mb-0">
            Puntos por pronosticar alguien y no terminar en el margen de resultados
          </h2>
          <p class="ui-content italic">
            Ejemplo: Se pronostican 10 puestos en carrera, pronostica un piloto en la 8ª posición, pero el resultado de este piloto es la 15ª (fuera del margen)
          </p>
          <div class="ui-grid">
            <div class="ui-column">
              <PField label="Clasificación">
                <PNumberInput v-model="pointsIfIsNotInResults.QUALIFY" />
              </PField>
            </div>
            <div class="ui-column">
              <PField label="Carrera">
                <PNumberInput v-model="pointsIfIsNotInResults.RACE" />
              </PField>
            </div>
          </div>
          <hr>
          <PField label="Privacidad del conjunto de reglas">
            <PSwitch
              v-model="rulesetPrivacy"
              color="danger"
              inactive-color="success"
            >
              {{ rulesetPrivacy ? "Privadas" : "Públicas" }}
            </PSwitch>
          </PField>
          <p class="block">
            Esta opción determinará si otras comunidades ajenas a ti podrán utilizar tus reglas o no.
          </p>
        </template>

        <template #step-2>
          <h1 class="ui-title ui-text-center">
            Finalizar
          </h1>

          <AlertInvalidData
            :object="name"
            message="No has introducido nombre de la comunidad"
          />
          <AlertInvalidData
            :object="description"
            message="No has introducido descripción de la comunidad"
          />

          <PrognoAlert variant="warning">
            Revisa los datos, se va a registrar la siguiente comunidad
          </PrognoAlert>

          <div class="ui-grid">
            <div class="ui-column ui-col-3">
              <div class="ui-card">
                <div class="ui-card-content">
                  <figure class="ui-image">
                    <img
                      v-if="imageUrl"
                      :src="imageUrl"
                      alt="Community logo"
                    >
                    <img
                      v-else
                      src="https://prognosports.com/logo_bw.png"
                      alt="Community logo"
                    >
                  </figure>
                </div>

                <div class="ui-card-content">
                  <div class="ui-media">
                    <div class="ui-media-content">
                      <p class="ui-title ui-title-4">
                        {{ name }}
                      </p>
                      <p class="ui-subtitle ui-subtitle-6">
                        {{ description }}
                      </p>
                    </div>
                  </div>

                  <div class="ui-content">
                    <p class="card-text">
                      <b>Creador: {{ currentUser.username }} </b>
                    </p>
                    <p
                      v-if="privacy"
                      class="card-text ui-text-danger"
                    >
                      Comunidad cerrada/privada
                    </p>
                    <p
                      v-else
                      class="card-text ui-text-success"
                    >
                      Comunidad abierta/pública
                    </p>
                    <p class="card-text">
                      <b>Posiciones de clasificación pronosticadas</b>:
                      {{ numberQualify }}
                    </p>
                    <p class="card-text">
                      <b>Posiciones de carrera pronosticadas</b>:
                      {{ numberRace }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="ui-column">
              <div class="ui-card">
                <div class="ui-card-content">
                  <p class="ui-title">
                    Reglas y puntuaciones
                  </p>
                </div>
                <div class="ui-card-content">
                  <p class="ui-subtitle">
                    Puntos por acertar posiciones
                  </p>
                  <div class="ui-content">
                    <table class="ui-table ui-hoverable ui-striped">
                      <thead>
                        <tr>
                          <th>Posición</th>
                          <th>Clasificación</th>
                          <th>Carrera</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="pos in Math.max(numberQualify, numberRace)" :key="pos">
                          <th>{{ pos }}º</th>
                          <td>{{ (numberQualify >= pos) ? (pointsByEqualsPosition.QUALIFY[pos] || 0) : 0 }}</td>
                          <td>{{ (numberRace >= pos) ? (pointsByEqualsPosition.RACE[pos] || 0) : 0 }}</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <th>Posición</th>
                          <th>Clasificación</th>
                          <th>Carrera</th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <p class="ui-subtitle">
                    Posiciones no acertadas
                  </p>
                  <div class="ui-content">
                    <table class="ui-table ui-hoverable">
                      <thead>
                        <tr>
                          <th />
                          <th>Clasificación</th>
                          <th>Carrera</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Posición siguiente</td>
                          <td>{{ pointsByNextPosition.QUALIFY }}</td>
                          <td>{{ pointsByNextPosition.RACE }}</td>
                        </tr>
                        <tr>
                          <td>Posición siguiente de la siguiente</td>
                          <td>{{ pointsByNextOfFollowingPosition.QUALIFY }}</td>
                          <td>{{ pointsByNextOfFollowingPosition.RACE }}</td>
                        </tr>
                        <tr>
                          <td>Posición anterior</td>
                          <td>{{ pointsByPreviousPosition.QUALIFY }}</td>
                          <td>{{ pointsByPreviousPosition.RACE }}</td>
                        </tr>
                        <tr>
                          <td>Posición anterior de la anterior</td>
                          <td>{{ pointsByPreviousOfPreviousPosition.QUALIFY }}</td>
                          <td>{{ pointsByPreviousOfPreviousPosition.RACE }}</td>
                        </tr>
                        <tr>
                          <td>No en el podio</td>
                          <td>{{ pointsIfIsNotInPodium.QUALIFY }}</td>
                          <td>{{ pointsIfIsNotInPodium.RACE }}</td>
                        </tr>
                        <tr>
                          <td>No en los resultados</td>
                          <td>{{ pointsIfIsNotInResults.QUALIFY }}</td>
                          <td>{{ pointsIfIsNotInResults.RACE }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr>
          <PButton
            :disabled="!name || !description"
            label="Registrar comunidad"
            color="primary"
            @click="registerCommunity()"
          />
        </template>
      </PStepper>
    </section>
  </PCard>
</template>

<script lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import {communityService, notificationService, rulesetService} from "@/_services";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import useEmitter from "@/composables/useEmitter";
import PButton from "@/components/lib/forms/PButton.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import PField from "@/components/lib/forms/PField.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import AlertInvalidData from "@/components/lib/AlertInvalidData.vue";
import PCard from "@/components/lib/PCard.vue";
import PStepper from "@/components/lib/PStepper.vue";
import PSwitch from "@/components/lib/forms/PSwitch.vue";
import PRangeInput from "@/components/lib/forms/PRangeInput.vue";
import PNumberInput from "@/components/lib/forms/PNumberInput.vue";

export default defineComponent({
    name: "CreateCommunity",
    components: {
      PCard,
      PStepper,
      PSwitch,
      PRangeInput,
      PNumberInput,
      AlertInvalidData,
      PrognoAlert,
      PField,
      PInput,
      PButton,
        PTitle
    },
    setup() {
        const emitter = useEmitter();
        const authStore = useAuthStore();
        const communityStore = useCommunityStore();

        const currentUser = authStore.loggedUser;
        const setCommunity = communityStore.setCommunity;
        return { currentUser, setCommunity, emitter };
    },
    data() {
        return {
            activeStep: 0,
            name: "",
            description: "",
            imageUrl: "",
            privacy: false,

            numberQualify: 4,
            numberRace: 10,

            rulesetName: "",
            rulesetDescription: "",
            rulesetPrivacy: false,

            pointsByEqualsPosition: {
                QUALIFY: {
                    1: 20,
                    2: 16,
                    3: 12,
                    4: 10
                },
                RACE: {
                    1: 25,
                    2: 20,
                    3: 18,
                    4: 16,
                    5: 14,
                    6: 12,
                    7: 10,
                    8: 8,
                    9: 4,
                    10: 2
                }
            },
            pointsByNextPosition: {
                QUALIFY: 2,
                RACE: 2,
            },
            pointsByNextOfFollowingPosition: {
                QUALIFY: 1,
                RACE: 1,
            },
            pointsByPreviousPosition: {
                QUALIFY: 2,
                RACE: 2,
            },
            pointsByPreviousOfPreviousPosition: {
                QUALIFY: 1,
                RACE: 1,
            },
            pointsIfIsNotInPodium: {
                QUALIFY: 0,
                RACE: 0,
            },
            pointsIfIsNotInResults: {
                QUALIFY: 0,
                RACE: 0,
            }
        }
    },
    watch: {
        name(newName, oldName) {
            if (!this.rulesetName) {
                this.rulesetName = "Reglas por defecto de " + name;
            }
            if (!this.rulesetDescription) {
                this.rulesetDescription = "Reglas por defecto de " + name;
            }
        }
    },
    methods: {
        registerCommunity() {
            let rulesetData = {
                isPublic: this.rulesetPrivacy,
                displayname: this.rulesetName,
                description: this.rulesetDescription,
                data: {
                    pointsByEqualsPosition: this.pointsByEqualsPosition,
                    pointsByNextPosition: this.pointsByNextPosition,
                    pointsByNextOfFollowingPosition: this.pointsByNextOfFollowingPosition,
                    pointsByPreviousPosition: this.pointsByPreviousPosition,
                    pointsByPreviousOfPreviousPosition: this.pointsByPreviousOfPreviousPosition,
                    pointsIfIsNotInPodium: this.pointsIfIsNotInPodium,
                    pointsIfIsNotInResults: this.pointsIfIsNotInResults
                }
            }
            let communityData = {
                name: this.name,
                description: this.description,
                image_url: this.imageUrl,
                owner: this.currentUser.id,
                open: !this.privacy,
                default_rule_set: 1, //FixMe: Creador de rulesets
            };

            // Primero se crea el RuleSet
            rulesetService.createRuleSet(rulesetData).then((ruleset) => {
                communityData.default_rule_set = ruleset.id; // y se asigna este rule set por defecto a la nueva comunidad

                communityService.createCommunity(communityData).then((community) => {
                    notificationService.showNotification("Se ha registrado correctamente la comunidad `" + community.name + "`");

                    this.$router.push({
                        name: 'communitiesDetails',
                        params:  {
                            community: community.name,
                        }
                    })

                    this.setCommunity(community); // Establecer en Pinia la comunidad actual
                    this.emitter.emit('reloadCommunitiesDropdown'); // Recargar dropdown del navbar
                }).catch((error) => {
                    notificationService.showNotification(error.message, "error");
                    rulesetService.removeRuleSet(ruleset);
                })
            }).catch((error) => {
                notificationService.showNotification(error.message, "error");
            })
        }
    },
});
</script>
