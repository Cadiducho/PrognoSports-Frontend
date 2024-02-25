<template>
    <section v-if="ruleSet.id !== 0">

        <o-field label="Temporada" :label-position="'on-border'">
            <o-select v-if="Object.keys(chosenSeason).length" v-model="chosenSeason" placeholder="Selecciona la temporada" @change="changeSeason()" >
                <option
                    v-for="season in seasonList"
                    :value="season"
                    :key="season.id">
                    {{ season.competition.name }} {{ season.name }}
                </option>
            </o-select>
        </o-field>

        <p>Esta comunidad en la temporada {{ chosenSeason.name }} usa el conjunto de reglas <i>{{ ruleSet.displayname }}.</i></p>

        <div class="content">
            <h5>Cantidad de posiciones pronosticadas:</h5>
        </div>

        <div class="content">
            <ul>
                <li v-for="session in competition.availableSessions" :key="session.id">
                    <b>{{ session.humanName() }}:</b> {{ ruleSet.data.predictedPositions[session.id] || 4 }} posiciones.
                </li>
            </ul>
            <hr/>

            <h4>Reparto de puntos</h4>
            <h6>Puntos Acertar posición exacta:</h6>
            <table class="is-hoverable is-striped block overflow-x-auto whitespace-nowrap">
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
                        {{ (ruleSet.data.pointsByEqualsPosition[session.id] || 0)[pos] || 0 }}
                    </td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <th>Total</th>
                    <td v-for="session in competition.availableSessions">
                        {{ maxPointsPerSession[session.id] || 0 }}
                    </td>
                </tr>
                </tfoot>
            </table>

            <h6>Puntos por otra combinación:</h6>
            <table class="is-hoverable block overflow-x-auto whitespace-nowrap">
                <thead>
                <tr>
                    <th></th>
                    <th v-for="session in competition.availableSessions">{{ session.humanName() }}</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Posición siguiente</td>
                    <td v-for="session in competition.availableSessions">{{ ruleSet.data.pointsByNextPosition[session.id] || 0 }}</td>
                </tr>
                <tr>
                    <td>Posición siguiente de la siguiente</td>
                    <td v-for="session in competition.availableSessions">{{ ruleSet.data.pointsByNextOfFollowingPosition[session.id] || 0 }}</td>
                </tr>
                <tr>
                    <td>Posición anterior</td>
                    <td v-for="session in competition.availableSessions">{{ ruleSet.data.pointsByPreviousPosition[session.id] || 0 }}</td>
                </tr>
                <tr>
                    <td>Posición anterior de la anterior</td>
                    <td v-for="session in competition.availableSessions">{{ ruleSet.data.pointsByPreviousOfPreviousPosition[session.id] || 0 }}</td>
                </tr>
                <tr>
                    <td>No en el podio</td>
                    <td v-for="session in competition.availableSessions">{{ ruleSet.data.pointsIfIsNotInPodium[session.id] || 0 }}</td>
                </tr>
                <tr>
                    <td>No en los resultados</td>
                    <td v-for="session in competition.availableSessions">{{ ruleSet.data.pointsIfIsNotInResults[session.id] || 0 }}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </section>

</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {Community} from "@/types/Community";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";
import {competitionService, rulesetService, seasonService} from "@/_services";
import {RuleSet} from "@/types/RuleSet";

export default defineComponent({
    name: "RulesAndPointsTable",
    props: {
        community: {
            type: Object as PropType<Community>,
            required: true
        },
    },
    data() {
        return {
            chosenSeason: {id: 0} as Season,
            ruleSet: {id: 0} as RuleSet,
            seasonList: new Array<Season>(),
            competition: {id: 0} as Competition,
        }
    },
    async mounted() {
        seasonService.getSeasonList().then((seasons) => {
            this.seasonList = [];
            this.seasonList.push(...seasons);
        });

        this.competition = await competitionService.getCompetition(this.community.competition.id);
        this.chosenSeason = this.competition.currentSeason;

        this.getRuleSetOfSeason(this.community, this.chosenSeason);
    },
    computed: {
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
        },
        maxPointsPerSession() {
            let sessions: Record<string, number> = {};
            this.competition.availableSessions.forEach(session => {
                const map = this.ruleSet.data.pointsByEqualsPosition[session.id];
                if (map) {
                    sessions[session.id] = 0;
                    for (const kPos of Object.values(map)) {
                        const point = Number.parseInt(kPos);
                        sessions[session.id] += point;
                    }
                }
            });
            return sessions;
        }
    },
    methods: {
        changeSeason() {
            this.getRuleSetOfSeason(this.community, this.chosenSeason!);
        },
        async getRuleSetOfSeason(community: Community, season: Season) {
            const rules = await rulesetService.getRuleSetInSeason(community, season);
            this.ruleSet = rules;

            console.log(this.ruleSet)
        }
    }
})
</script>

<style scoped lang="scss">

</style>