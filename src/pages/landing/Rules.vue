<template>
    <div class="container mt-6 mb-6">
        <h1 class="title">Reglas y normativa</h1>

        <p class="content">Cada Competición y Comunidad tendrán su normativa añadida a esta general, especificando reglas en los pronósticos o en el cálculo de resultados y puntuaciones.</p>
        <section class="content">
            <h2>Generales</h2>
            <section>
                <ul>
                    <li>Se sancionará el abuso de posibles errores en beneficio propio que permitan, por ejemplo, pronosticar fuera de plazo o visualizar datos que deberían estar ocultos. En caso de encontrarse uno de estos errores, el usuario deberá avisar a un administrador de la plataforma.</li>
                    <li><b>PrognoSports</b> no permite la apología de odio en los nicks de usuarios, fotos de perfil, biografía o cualquier otro campo de la plataforma.</li>
                </ul>
            </section>
        </section>

        <section class="content" v-if="competition.id !== 0">
            <h2>Competición {{ competition.name }}</h2>
            <section>
                <p v-html="compiledRules"></p>
            </section>
        </section>

        <section class="content" v-if="currentCommunity && competition.id !== 0">
            <h2>Normas y puntuaciones de la comunidad {{ currentCommunity.name }}</h2>
            <section>
                <p>Esta comunidad usa el conjunto de reglas <i>{{ currentCommunity.defaultRuleSet.displayname }}.</i>
                </p>

                <div class="content">
                    <h5>Cantidad de posiciones pronosticadas:</h5>
                </div>

                <div class="content">
                    <ul>
                        <li v-for="session in competition.availableSessions" :key="session.name">
                            <b>{{ session.humanName() }}:</b> {{ currentCommunity.defaultRuleSet.data.predictedPositions[session.name] || 4 }} posiciones.
                        </li>
                    </ul>
                    <hr/>

                    <h4>Reparto de puntos</h4>
                    <h6>Puntos Acertar posición exacta:</h6>
                    <table class="table is-hoverable is-striped">
                        <thead>
                            <tr>
                                <th>Posición</th>
                                <th v-for="session in competition.availableSessions">{{ session.humanName() }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="pos in positionsInRuleSet">
                                <th>{{ pos }}º</th>
                                <td v-for="session in competition.availableSessions">
                                    {{ (ruleSet.data.pointsByEqualsPosition[session.name] || 0)[pos] || 0}}
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Posición</th>
                                <th v-for="session in competition.availableSessions">{{ session.humanName() }}</th>
                            </tr>
                        </tfoot>
                    </table>

                    <h6>Puntos por otra combinación:</h6>
                    <table class="table is-hoverable">
                        <thead>
                            <tr>
                                <th></th>
                                <th v-for="session in competition.availableSessions">{{ session.humanName() }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Posición siguiente</td>
                                <td v-for="session in competition.availableSessions">{{ ruleSet.data.pointsByNextPosition[session.name] || 0 }}</td>
                            </tr>
                            <tr>
                                <td>Posición siguiente de la siguiente</td>
                                <td v-for="session in competition.availableSessions">{{ ruleSet.data.pointsByNextOfFollowingPosition[session.name] || 0 }}</td>
                            </tr>
                            <tr>
                                <td>Posición anterior</td>
                                <td v-for="session in competition.availableSessions">{{ ruleSet.data.pointsByPreviousPosition[session.name] || 0 }}</td>
                            </tr>
                            <tr>
                                <td>Posición anterior de la anterior</td>
                                <td v-for="session in competition.availableSessions">{{ ruleSet.data.pointsByPreviousOfPreviousPosition[session.name] || 0 }}</td>
                            </tr>
                            <tr>
                                <td>No en el podio</td>
                                <td v-for="session in competition.availableSessions">{{ ruleSet.data.pointsIfIsNotInPodium[session.name] || 0 }}</td>
                            </tr>
                            <tr>
                                <td>No en los resultados</td>
                                <td v-for="session in competition.availableSessions">{{ ruleSet.data.pointsIfIsNotInResults[session.name] || 0 }}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th></th>
                                <th v-for="session in competition.availableSessions">{{ session.humanName() }}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </section>
        </section>

        <p class="content">
            Más enlaces de interés: <router-link :to="{name: 'terms'}">Términos y Condiciones</router-link> · <router-link :to="{name: 'privacy'}">Políticas de Privacidad</router-link>
        </p>
    </div>
</template>

<script lang="ts">
import {Competition} from "@/types/Competition";
import {marked} from 'marked';
import {competitionService} from "@/_services";
import {RuleSet} from "@/types/RuleSet";
import {isValidCommunity} from "@/utils";
import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";

export default defineComponent({
    name: "Rules",
    setup() {
        const authStore = useAuthStore();
        const communityStore = useCommunityStore();

        const currentUser = authStore.loggedUser;
        const currentCommunity = communityStore.community;

        return { currentUser, currentCommunity };
    },
    data() {
        return {
            competition: {id: 0} as Competition,
            compiledRules: ""
        }
    },
    mounted() {
        if (isValidCommunity(this.currentCommunity)) {
            competitionService.getCompetition(this.currentCommunity.competition.code)
                .then(c => {
                    this.competition = c;
                    this.compiledRules = marked(c.rules ?? "");
                });
        }
    },
    computed: {
        ruleSet(): RuleSet {
            return this.currentCommunity.defaultRuleSet;
        },
        maxPosInRuleSet(): number {
            let max = 0;
            this.competition.availableSessions.forEach(session => {
                let map = this.ruleSet.data.pointsByEqualsPosition[session.name];
                if (map !== undefined) {
                    for (let kPos of Object.keys(map)) {
                        const pos = Number.parseInt(kPos);
                        if (pos > max) max = pos;
                    }
                }
            });
            return max;
        },
        positionsInRuleSet() {
            let postions = [];
            for (let i = 1; i <= this.maxPosInRuleSet; ++i) {
                postions.push(i);
            }
            return postions;
        }
    }
});
</script>