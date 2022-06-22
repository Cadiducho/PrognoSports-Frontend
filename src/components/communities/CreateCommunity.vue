<template>
    <div id="createCommunity" class="box">
        <PrognoPageTitle class="mb-5" name="Crear comunidad" />

        <section>
            <o-steps v-model="activeStep">
                <o-step-item step="1" label="Descripción">
                    <h1 class="title has-text-centered">Descripción</h1>

                    <o-field label="Nombre" message="Nombre de la comunidad">
                        <o-input v-model="name" name="subject" expanded lazy></o-input>
                    </o-field>

                    <o-field label="Descripción">
                        <o-input v-model="description" type="textarea" lazy></o-input>
                    </o-field>

                    <o-field label="Imagen" message="Imagen para la comunidad (URL)">
                        <o-input v-model="imageUrl" name="image" expanded></o-input>
                    </o-field>

                    <hr/>

                    <p class="block">Con una comunidad cerrada sólo se podrán unir miembros que dispongan del enlace de invitación. <br/>
                        Cualquiera podrá acceder a una comunidad abierta.</p>
                    <o-field label="Privacidad de la comunidad">
                        <o-switch
                            v-model="privacy"
                            passive-type='is-success'
                            type='is-danger'>
                            {{ privacy ? "Cerrada" : "Abierta" }}
                        </o-switch>
                    </o-field>
                </o-step-item>

                <o-step-item step="2" label="Reglas">
                    <h1 class="title has-text-centered">Reglas</h1>

                    <!-- FixMe: al creador de rulesets -->
                    <div class="columns">
                        <div class="column">
                            <o-field label="Posiciones pronosticadas en clasificación">
                                <o-slider v-model="numberQualify" :min="3" :max="20" :tooltip="false" indicator ticks></o-slider>
                            </o-field>
                        </div>
                        <div class="column">
                            <o-field label="Posiciones pronosticadas en carrera">
                                <o-slider v-model="numberRace" :min="3" :max="20" :tooltip="false" indicator ticks></o-slider>
                            </o-field>
                        </div>
                    </div>

                    <h1 class="title has-text-centered">Puntuaciones</h1>

                    <h2 class="subtitle mb-0">Descripción del conjunto de reglas</h2>
                    <p class="content">Un conjunto de reglas podrá ser utilizado por otra comunidad, o podrás usar otros diferentes en cada carrera. Conviene poner un nombre y descripción</p>
                    <o-field label="Nombre del conjunto de reglas">
                        <o-input v-model="rulesetName" name="subject" expanded></o-input>
                    </o-field>
                    <o-field label="Descripción de las reglas">
                        <o-input v-model="rulesetDescription" type="textarea"></o-input>
                    </o-field>

                    <h2 class="subtitle mb-0">Puntos por acertar la posición</h2>
                    <div class="columns">
                        <div class="column">
                            <p class="content is-italic">Posiciones de clasificación</p>
                            <template v-for="pos in numberQualify">
                                <o-field :label="pos + 'º puesto de Clasificación'">
                                    <o-numberinput v-model="pointsByEqualsPosition.QUALIFY[pos]"></o-numberinput>
                                </o-field>
                            </template>
                        </div>

                        <div class="column">

                            <p class="content is-italic">Posiciones de carrera</p>
                            <template v-for="pos in numberRace">
                                <o-field :label="pos + 'º puesto de Carrera'">
                                    <o-numberinput v-model="pointsByEqualsPosition.RACE[pos]"></o-numberinput>
                                </o-field>
                            </template>
                        </div>
                    </div>
                    <hr/>


                    <h2 class="subtitle mb-0">Puntos por posición siguiente</h2>
                    <p class="content is-italic">
                        Ejemplo: Pronostica un piloto en la 7ª posición, pero el resultado de este piloto es la 6ª
                    </p>
                    <div class="columns">
                        <div class="column">
                            <o-field label="Clasificación">
                                <o-numberinput v-model="pointsByNextPosition.QUALIFY"></o-numberinput>
                            </o-field>
                        </div>
                        <div class="column">
                            <o-field label="Carrera">
                                <o-numberinput v-model="pointsByNextPosition.RACE"></o-numberinput>
                            </o-field>
                        </div>
                    </div>
                    <hr/>

                    <h2 class="subtitle mb-0">Puntos por posición siguiente de la siguiente</h2>
                    <p class="content is-italic">
                        Ejemplo: Pronostica un piloto en la 7ª posición, pero el resultado de este piloto es la 5ª
                    </p>
                    <div class="columns">
                        <div class="column">
                            <o-field label="Clasificación">
                                <o-numberinput v-model="pointsByNextOfFollowingPosition.QUALIFY"></o-numberinput>
                            </o-field>
                        </div>
                        <div class="column">
                            <o-field label="Carrera">
                                <o-numberinput v-model="pointsByNextOfFollowingPosition.RACE"></o-numberinput>
                            </o-field>
                        </div>
                    </div>
                    <hr/>

                    <h2 class="subtitle mb-0">Puntos por posición anterior</h2>
                    <p class="content is-italic">
                        Ejemplo: Pronostica un piloto en la 3ª posición, pero el resultado de este piloto es la 4ª
                    </p>
                    <div class="columns">
                        <div class="column">
                            <o-field label="Clasificación">
                                <o-numberinput v-model="pointsByPreviousPosition.QUALIFY"></o-numberinput>
                            </o-field>
                        </div>
                        <div class="column">
                            <o-field label="Carrera">
                                <o-numberinput v-model="pointsByPreviousPosition.RACE"></o-numberinput>
                            </o-field>
                        </div>
                    </div>
                    <hr/>

                    <h2 class="subtitle mb-0">Puntos por posición anterior de la anterior</h2>
                    <p class="content is-italic">
                        Ejemplo: Pronostica un piloto en la 3ª posición, pero el resultado de este piloto es la 5ª
                    </p>
                    <div class="columns">
                        <div class="column">
                            <o-field label="Clasificación">
                                <o-numberinput v-model="pointsByPreviousOfPreviousPosition.QUALIFY"></o-numberinput>
                            </o-field>
                        </div>
                        <div class="column">
                            <o-field label="Carrera">
                                <o-numberinput v-model="pointsByPreviousOfPreviousPosition.RACE"></o-numberinput>
                            </o-field>
                        </div>
                    </div>
                    <hr/>

                    <h2 class="subtitle mb-0">Puntos por pronosticar a alguien en podio y fallar</h2>
                    <p class="content is-italic">
                        Ejemplo: Pronostica un piloto en la 2ª posición, pero el resultado de este piloto es la 8ª (fuera del podio)
                    </p>
                    <div class="columns">
                        <div class="column">
                            <o-field label="Clasificación">
                                <o-numberinput v-model="pointsIfIsNotInPodium.QUALIFY"></o-numberinput>
                            </o-field>
                        </div>
                        <div class="column">
                            <o-field label="Carrera">
                                <o-numberinput v-model="pointsIfIsNotInPodium.RACE"></o-numberinput>
                            </o-field>
                        </div>
                    </div>
                    <hr/>

                    <h2 class="subtitle mb-0">Puntos por pronosticar alguien y no terminar en el margen de resultados</h2>
                    <p class="content is-italic">
                        Ejemplo: Se pronostican 10 puestos en carrera, pronostica un piloto en la 8ª posición, pero el resultado de este piloto es la 15ª (fuera del margen)
                    </p>
                    <div class="columns">
                        <div class="column">
                            <o-field label="Clasificación">
                                <o-numberinput v-model="pointsIfIsNotInResults.QUALIFY"></o-numberinput>
                            </o-field>
                        </div>
                        <div class="column">
                            <o-field label="Carrera">
                                <o-numberinput v-model="pointsIfIsNotInResults.RACE"></o-numberinput>
                            </o-field>
                        </div>
                    </div>
                    <hr/>
                    <o-field label="Privacidad del conjunto de reglas">
                        <o-switch
                            v-model="rulesetPrivacy"
                            passive-type='is-success'
                            type='is-danger'>
                            {{ rulesetPrivacy ? "Privadas" : "Públicas" }}
                        </o-switch>
                    </o-field>
                    <p class="block">Esta opción determinará si otras comunidades ajenas a ti podrán utilizar tus reglas o no.</p>
                </o-step-item>

                <o-step-item step="3" label="Finalizar">
                    <h1 class="title has-text-centered">Finalizar</h1>
                    <o-notification v-if="!name" variant="danger" aria-close-label="Close notification" role="alert">
                        No has introducido nombre de la comunidad
                    </o-notification>
                    <o-notification v-if="!description" variant="danger" aria-close-label="Close notification" role="alert">
                        No has introducido descripción de la comunidad
                    </o-notification>
                    <div class="notification has-background-primary">
                        Revisa los datos, se va a registrar la siguiente comunidad
                    </div>

                    <div class="columns">
                        <div class="column is-3">
                            <div class="card">
                                <div class="card-image">
                                    <figure class="image">
                                        <img v-if="imageUrl" :src="imageUrl" alt="Community logo">
                                        <img v-else src="https://prognosports.com/logo_bw.png" alt="Community logo">
                                    </figure>
                                </div>

                                <div class="card-content">
                                    <div class="media">
                                        <div class="media-content">
                                            <p class="title is-4">{{name}}</p>
                                            <p class="subtitle is-6">{{description}}</p>
                                        </div>
                                    </div>

                                    <div class="content">
                                        <p class="card-text"><b>Creador: {{currentUser.username}} </b></p>
                                        <p v-if="privacy" class="card-text has-text-danger">Comunidad cerrada/privada</p>
                                        <p v-else class="card-text has-text-success">Comunidad abierta/pública</p>
                                        <p class="card-text"><b>Posiciones de clasificación pronosticadas</b>:
                                            {{ numberQualify }}</p>
                                        <p class="card-text"><b>Posiciones de carrera pronosticadas</b>:
                                            {{ numberRace }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="column">
                            <div class="card">
                                <div class="card-content">
                                    <p class="title">
                                        Reglas y puntuaciones
                                    </p>
                                </div>
                                <div class="card-content">
                                    <p class="subtitle">
                                        Puntos por acertar posiciones
                                    </p>
                                    <div class="content">
                                        <table class="table is-hoverable is-striped">
                                            <thead>
                                                <tr>
                                                    <th>Posición</th>
                                                    <th>Clasificación</th>
                                                    <th>Carrera</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="pos in Math.max(numberQualify, numberRace)">
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

                                    <p class="subtitle">
                                        Posiciones no acertadas
                                    </p>
                                    <div class="content">
                                        <table class="table is-hoverable">
                                            <thead>
                                                <tr>
                                                    <th></th>
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

                    <hr/>
                    <o-field>
                        <p class="control">
                            <o-button :disabled="!name || !description" label="Registrar comunidad" @click="registerCommunity()" variant="primary" />
                        </p>
                    </o-field>
                </o-step-item>
            </o-steps>

        </section>
    </div>
</template>

<script lang="ts">
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import {communityService, rulesetService} from "@/_services";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import useEmitter from "@/composables/useEmitter";

export default defineComponent({
    name: "ViewCommunitiesList",
    components: {
        PrognoPageTitle
    },
    setup() {
        const emitter = useEmitter();
        const authStore = useAuthStore();
        const communityStore = useCommunityStore();

        const currentUser = authStore.user;
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
            rulesetPrivacy: "",

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
                    this.$oruga.notification.open({
                        position: 'top',
                        message: "Se ha registrado correctamente la comunidad `" + community.name + "`",
                        variant: "success",
                    });

                    this.$router.push({
                        name: 'communitiesDetails',
                        params:  {
                            community: community.name,
                        }
                    })

                    this.setCommunity(community); // Establecer en Pinia la comunidad actual
                    this.emitter.emit('reloadCommunitiesDropdown'); // Recargar dropdown del navbar
                }).catch((error) => {
                    this.$oruga.notification.open({
                        position: 'top',
                        message: error.message,
                        variant: "danger",
                    });
                    rulesetService.removeRuleSet(ruleset).then(e => {
                        console.log(e);
                    }).catch(e => {
                        console.log(e);
                    });
                })
            }).catch((error) => {
                this.$oruga.notification.open({
                    position: 'top',
                    message: error.message,
                    variant: "danger",
                });
            })
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
});
</script>