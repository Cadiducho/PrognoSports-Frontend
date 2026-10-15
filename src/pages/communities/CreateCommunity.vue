<template>
  <PPage>
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
      <PStepper
        v-model="activeStep"
        :steps="[{ label: 'Descripción' }, { label: 'Reglas' }, { label: 'Finalizar' }]"
      >
        <template #step-0>
          <PTitle
            tag="h1"
            type="title"
            align="center"
          >
            Descripción
          </PTitle>

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

          <PDivider />

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
          <PTitle
            tag="h1"
            type="title"
            align="center"
          >
            Reglas
          </PTitle>

          <!-- FixMe: al creador de rulesets -->
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="min-w-0">
              <PField label="Posiciones pronosticadas en clasificación">
                <PRangeInput
                  v-model="numberQualify"
                  :min="3"
                  :max="20"
                  ticks
                />
              </PField>
            </div>
            <div class="min-w-0">
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

          <PTitle
            tag="h1"
            type="title"
            align="center"
          >
            Puntuaciones
          </PTitle>

          <PTitle
            tag="h2"
            type="subtitle"
            no-margin
          >
            Descripción del conjunto de reglas
          </PTitle>
          <p class="text-gray-700 dark:text-gray-300">
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

          <PTitle
            tag="h2"
            type="subtitle"
            no-margin
          >
            Puntos por acertar la posición
          </PTitle>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="min-w-0">
              <p class="text-gray-700 dark:text-gray-300 italic">
                Posiciones de clasificación
              </p>
              <template
                v-for="pos in numberQualify"
                :key="`qualify-${pos}`"
              >
                <PField :label="pos + 'º puesto de Clasificación'">
                  <PNumberInput v-model="pointsByEqualsPosition.QUALIFY[pos]" />
                </PField>
              </template>
            </div>

            <div class="min-w-0">
              <p class="text-gray-700 dark:text-gray-300 italic">
                Posiciones de carrera
              </p>
              <template
                v-for="pos in numberRace"
                :key="`race-${pos}`"
              >
                <PField :label="pos + 'º puesto de Carrera'">
                  <PNumberInput v-model="pointsByEqualsPosition.RACE[pos]" />
                </PField>
              </template>
            </div>
          </div>
          <PDivider />


          <PTitle
            tag="h2"
            type="subtitle"
            no-margin
          >
            Puntos por posición siguiente
          </PTitle>
          <p class="text-gray-700 dark:text-gray-300 italic">
            Ejemplo: Pronostica un piloto en la 7ª posición, pero el resultado de este piloto es la 6ª
          </p>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="min-w-0">
              <PField label="Clasificación">
                <PNumberInput v-model="pointsByNextPosition.QUALIFY" />
              </PField>
            </div>
            <div class="min-w-0">
              <PField label="Carrera">
                <PNumberInput v-model="pointsByNextPosition.RACE" />
              </PField>
            </div>
          </div>
          <PDivider />

          <PTitle
            tag="h2"
            type="subtitle"
            no-margin
          >
            Puntos por posición siguiente de la siguiente
          </PTitle>
          <p class="text-gray-700 dark:text-gray-300 italic">
            Ejemplo: Pronostica un piloto en la 7ª posición, pero el resultado de este piloto es la 5ª
          </p>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="min-w-0">
              <PField label="Clasificación">
                <PNumberInput v-model="pointsByNextOfFollowingPosition.QUALIFY" />
              </PField>
            </div>
            <div class="min-w-0">
              <PField label="Carrera">
                <PNumberInput v-model="pointsByNextOfFollowingPosition.RACE" />
              </PField>
            </div>
          </div>
          <PDivider />

          <PTitle
            tag="h2"
            type="subtitle"
            no-margin
          >
            Puntos por posición anterior
          </PTitle>
          <p class="text-gray-700 dark:text-gray-300 italic">
            Ejemplo: Pronostica un piloto en la 3ª posición, pero el resultado de este piloto es la 4ª
          </p>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="min-w-0">
              <PField label="Clasificación">
                <PNumberInput v-model="pointsByPreviousPosition.QUALIFY" />
              </PField>
            </div>
            <div class="min-w-0">
              <PField label="Carrera">
                <PNumberInput v-model="pointsByPreviousPosition.RACE" />
              </PField>
            </div>
          </div>
          <PDivider />

          <PTitle
            tag="h2"
            type="subtitle"
            no-margin
          >
            Puntos por posición anterior de la anterior
          </PTitle>
          <p class="text-gray-700 dark:text-gray-300 italic">
            Ejemplo: Pronostica un piloto en la 3ª posición, pero el resultado de este piloto es la 5ª
          </p>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="min-w-0">
              <PField label="Clasificación">
                <PNumberInput v-model="pointsByPreviousOfPreviousPosition.QUALIFY" />
              </PField>
            </div>
            <div class="min-w-0">
              <PField label="Carrera">
                <PNumberInput v-model="pointsByPreviousOfPreviousPosition.RACE" />
              </PField>
            </div>
          </div>
          <PDivider />

          <PTitle
            tag="h2"
            type="subtitle"
            no-margin
          >
            Puntos por pronosticar a alguien en podio y fallar
          </PTitle>
          <p class="text-gray-700 dark:text-gray-300 italic">
            Ejemplo: Pronostica un piloto en la 2ª posición, pero el resultado de este piloto es la 8ª (fuera del podio)
          </p>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="min-w-0">
              <PField label="Clasificación">
                <PNumberInput v-model="pointsIfIsNotInPodium.QUALIFY" />
              </PField>
            </div>
            <div class="min-w-0">
              <PField label="Carrera">
                <PNumberInput v-model="pointsIfIsNotInPodium.RACE" />
              </PField>
            </div>
          </div>
          <PDivider />

          <PTitle
            tag="h2"
            type="subtitle"
            no-margin
          >
            Puntos por pronosticar alguien y no terminar en el margen de resultados
          </PTitle>
          <p class="text-gray-700 dark:text-gray-300 italic">
            Ejemplo: Se pronostican 10 puestos en carrera, pronostica un piloto en la 8ª posición, pero el resultado de este piloto es la 15ª (fuera del margen)
          </p>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="min-w-0">
              <PField label="Clasificación">
                <PNumberInput v-model="pointsIfIsNotInResults.QUALIFY" />
              </PField>
            </div>
            <div class="min-w-0">
              <PField label="Carrera">
                <PNumberInput v-model="pointsIfIsNotInResults.RACE" />
              </PField>
            </div>
          </div>
          <PDivider />
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
          <PTitle
            tag="h1"
            type="title"
            align="center"
          >
            Finalizar
          </PTitle>

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

          <div class="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <div class="min-w-0">
              <PCard
                tag="div"
                padding="none"
              >
                <div class="p-4 sm:p-5">
                  <figure class="block overflow-hidden">
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

                <div class="p-4 sm:p-5">
                  <div class="flex items-start gap-4">
                    <div class="min-w-0 flex-1">
                      <PTitle
                        tag="p"
                        type="header"
                      >
                        {{ name }}
                      </PTitle>
                      <p class="text-base text-gray-600 dark:text-gray-300">
                        {{ description }}
                      </p>
                    </div>
                  </div>

                  <PProse>
                    <p class="text-sm">
                      <b>Creador: {{ currentUser.username }} </b>
                    </p>
                    <p
                      v-if="privacy"
                      class="text-sm text-error-600 dark:text-error-400"
                    >
                      Comunidad cerrada/privada
                    </p>
                    <p
                      v-else
                      class="text-sm text-success-600 dark:text-success-400"
                    >
                      Comunidad abierta/pública
                    </p>
                    <p class="text-sm">
                      <b>Posiciones de clasificación pronosticadas</b>:
                      {{ numberQualify }}
                    </p>
                    <p class="text-sm">
                      <b>Posiciones de carrera pronosticadas</b>:
                      {{ numberRace }}
                    </p>
                  </PProse>
                </div>
              </PCard>
            </div>
            <div class="min-w-0">
              <PCard
                tag="div"
                padding="none"
              >
                <div class="p-4 sm:p-5">
                  <PTitle
                    tag="p"
                    type="title"
                  >
                    Reglas y puntuaciones
                  </PTitle>
                </div>
                <div class="p-4 sm:p-5">
                  <PTitle
                    tag="p"
                    type="subtitle"
                  >
                    Puntos por acertar posiciones
                  </PTitle>
                  <PSimpleTable>
                    <template #head>
                      <tr>
                        <th>Posición</th>
                        <th>Clasificación</th>
                        <th>Carrera</th>
                      </tr>
                    </template>
                    <tr
                      v-for="pos in Math.max(numberQualify, numberRace)"
                      :key="pos"
                    >
                      <th>{{ pos }}º</th>
                      <td>{{ (numberQualify >= pos) ? (pointsByEqualsPosition.QUALIFY[pos] || 0) : 0 }}</td>
                      <td>{{ (numberRace >= pos) ? (pointsByEqualsPosition.RACE[pos] || 0) : 0 }}</td>
                    </tr>
                    <template #foot>
                      <tr>
                        <th>Posición</th>
                        <th>Clasificación</th>
                        <th>Carrera</th>
                      </tr>
                    </template>
                  </PSimpleTable>

                  <PTitle
                    tag="p"
                    type="subtitle"
                  >
                    Posiciones no acertadas
                  </PTitle>
                  <PSimpleTable>
                    <template #head>
                      <tr>
                        <th />
                        <th>Clasificación</th>
                        <th>Carrera</th>
                      </tr>
                    </template>
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
                  </PSimpleTable>
                </div>
              </PCard>
            </div>
          </div>

          <PDivider />
          <PButton
            :disabled="!name || !description"
            label="Registrar comunidad"
            color="primary"
            @click="registerCommunity()"
          />
        </template>
      </PStepper>
    </section>
  </PPage>
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
import PProse from "@/components/lib/PProse.vue";
import PDivider from "@/components/lib/PDivider.vue";
import PSimpleTable from "@/components/lib/table/PSimpleTable.vue";

export default defineComponent({
    name: "CreateCommunity",
    components: {
    PSimpleTable,
    PProse,
    PDivider,
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
