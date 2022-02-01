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
                    <table class="table is-hoverable is-striped">
                        <thead>
                            <tr>
                                <th>Posición</th>
                                <th v-for="session in competition.availableSessions">{{ sessionHumanName(session) }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="pos in positionsInRuleSet">
                                <th>{{ pos }}º</th>
                                <td v-for="session in competition.availableSessions">
                                    {{ (ruleSet.data.pointsByEqualsPosition[session] || 0)[pos] || 0}}
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Posición</th>
                                <th v-for="session in competition.availableSessions">{{ sessionHumanName(session) }}</th>
                            </tr>
                        </tfoot>
                    </table>

                    <table class="table is-hoverable">
                        <thead>
                            <tr>
                                <th></th>
                                <th v-for="session in competition.availableSessions">{{ sessionHumanName(session) }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Posición siguiente</td>
                                <td v-for="session in competition.availableSessions">{{ ruleSet.data.pointsByNextPosition[session] || 0 }}</td>
                            </tr>
                            <tr>
                                <td>Posición siguiente de la siguiente</td>
                                <td v-for="session in competition.availableSessions">{{ ruleSet.data.pointsByNextOfFollowingPosition[session] || 0 }}</td>
                            </tr>
                            <tr>
                                <td>Posición anterior</td>
                                <td v-for="session in competition.availableSessions">{{ ruleSet.data.pointsByPreviousPosition[session] || 0 }}</td>
                            </tr>
                            <tr>
                                <td>Posición anterior de la anterior</td>
                                <td v-for="session in competition.availableSessions">{{ ruleSet.data.pointsByPreviousOfPreviousPosition[session] || 0 }}</td>
                            </tr>
                            <tr>
                                <td>No en el podio</td>
                                <td v-for="session in competition.availableSessions">{{ ruleSet.data.pointsIfIsNotInPodium[session] || 0 }}</td>
                            </tr>
                            <tr>
                                <td>No en los resultados</td>
                                <td v-for="session in competition.availableSessions">{{ ruleSet.data.pointsIfIsNotInResults[session] || 0 }}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th></th>
                                <th v-for="session in competition.availableSessions">{{ sessionHumanName(session) }}</th>
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
import {Component, Vue} from "vue-property-decorator";
import {namespace} from "vuex-class";
import {Competition} from "@/types/Competition";
import {marked} from 'marked';
import {Community} from "@/types/Community";
import {User} from "@/types/User";
import {competitionService} from "@/_services";
import {RuleSet} from "@/types/RuleSet";

const Auth = namespace("Auth");

@Component
export default class RulesComponent extends Vue {

    @Auth.State("user") private currentUser!: User;
    @Auth.State("community") private currentCommunity!: Community;
    private competition: Competition = {id: 0} as Competition;
    private compiledRules: string = "";

    mounted() {
        if (this.currentCommunity) {
            competitionService.getCompetition(this.currentCommunity.competition.code)
                .then(c => {
                    this.competition = c;
                    this.compiledRules = marked(c.rules ?? "");
                });
        }
    }

    get ruleSet(): RuleSet {
        return this.currentCommunity.defaultRuleSet;
    }

    get maxPosInRuleSet(): number {
        let max = 0;
        this.competition.availableSessions.forEach(session => {
            let map = this.ruleSet.data.pointsByEqualsPosition[session];
            if (map !== undefined) {
                for (let kPos of Object.keys(map)) {
                    const pos = Number.parseInt(kPos);
                    if (pos > max) max = pos;
                }
            }
        });
        return max;
    }

    get positionsInRuleSet() {
        let postions = [];
        for (let i = 1; i <= this.maxPosInRuleSet; ++i) {
            postions.push(i);
        }
        return postions;
    }
}
</script>
<style scoped>
.card-header {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
}
</style>

