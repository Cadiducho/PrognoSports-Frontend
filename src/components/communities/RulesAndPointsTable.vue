<template>
  <section v-if="ruleSet.id !== 0">
    <PField label="Temporada">
      <PSelect
        v-if="Object.keys(chosenSeason).length"
        v-model="chosenSeason"
        placeholder="Selecciona la temporada"
        @change="changeSeason()"
      >
        <option
          v-for="season in seasonList"
          :key="season.id"
          :value="season"
        >
          {{ season.competition.name }} {{ season.name }}
        </option>
      </PSelect>
    </PField>

    <p class="mb-4 text-gray-700 dark:text-gray-300">
      Esta comunidad en la temporada {{ chosenSeason.name }} usa el conjunto de reglas <i>{{ ruleSet.displayname }}.</i>
    </p>

    <PTitle
      type="section"
      tag="h3"
    >
      Cantidad de posiciones pronosticadas
    </PTitle>
    <PProse>
      <ul>
        <li
          v-for="session in competition.availableSessions"
          :key="session.id"
        >
          <b>{{ session.humanName() }}:</b> {{ ruleSet.data.predictedPositions[session.id] || 4 }} posiciones.
        </li>
      </ul>
    </PProse>

    <PDivider />

    <PTitle
      type="header"
      tag="h3"
    >
      Reparto de puntos
    </PTitle>

    <PTitle
      type="section"
      tag="h4"
    >
      Puntos por acertar la posición exacta
    </PTitle>
    <PSimpleTable>
        <template #head>
          <tr>
            <th>Posición</th>
            <th
              v-for="session in competition.availableSessions"
              :key="session.id"
            >
              {{ session.humanName() }}
            </th>
          </tr>
        </template>
      <tr
        v-for="pos in positionsInRuleSet"
        :key="pos"
      >
        <th scope="row">
          {{ pos }}º
        </th>
        <td
          v-for="session in competition.availableSessions"
          :key="session.id"
        >
          {{ ruleSet.data.pointsByEqualsPosition[session.id][pos] || '-' }}
        </td>
      </tr>
      <template #foot>
      <tr>
          <th>Total por sesión</th>
          <td
            v-for="session in competition.availableSessions"
            :key="session.id"
          >
            {{ maxPointsPerSession[session.id] || 0 }}
          </td>
        </tr>
      <tr>
          <th>Bonus por más aciertos en el GP</th>
          <td :colspan="competition.availableSessions.length">
            {{ ruleSet.data.pointsByTopScorer || 0 }} puntos (global para todo el GP)
          </td>
        </tr>
      </template>
    </PSimpleTable>

    <PTitle
      class="mt-6"
      type="section"
      tag="h4"
    >
      Puntos por otra combinación
    </PTitle>
    <PSimpleTable>
        <template #head>
          <tr>
            <th></th>
            <th
              v-for="session in competition.availableSessions"
              :key="session.id"
            >
              {{ session.humanName() }}
            </th>
          </tr>
        </template>
      <tr>
          <td>Posición siguiente</td>
          <td
            v-for="session in competition.availableSessions"
            :key="session.id"
          >
            {{ ruleSet.data.pointsByNextPosition[session.id] || 0 }}
          </td>
        </tr>
      <tr>
          <td>Posición siguiente de la siguiente</td>
          <td
            v-for="session in competition.availableSessions"
            :key="session.id"
          >
            {{ ruleSet.data.pointsByNextOfFollowingPosition[session.id] || 0 }}
          </td>
        </tr>
      <tr>
          <td>Posición anterior</td>
          <td
            v-for="session in competition.availableSessions"
            :key="session.id"
          >
            {{ ruleSet.data.pointsByPreviousPosition[session.id] || 0 }}
          </td>
        </tr>
      <tr>
          <td>Posición anterior de la anterior</td>
          <td
            v-for="session in competition.availableSessions"
            :key="session.id"
          >
            {{ ruleSet.data.pointsByPreviousOfPreviousPosition[session.id] || 0 }}
          </td>
        </tr>
      <tr>
          <td>No en el podio</td>
          <td
            v-for="session in competition.availableSessions"
            :key="session.id"
          >
            {{ ruleSet.data.pointsIfIsNotInPodium[session.id] || 0 }}
          </td>
        </tr>
      <tr>
          <td>No en los resultados</td>
          <td
            v-for="session in competition.availableSessions"
            :key="session.id"
          >
            {{ ruleSet.data.pointsIfIsNotInResults[session.id] || 0 }}
          </td>
        </tr>
    </PSimpleTable>
  </section>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {Community} from "@/types/Community";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";
import {competitionService, rulesetService, seasonService} from "@/_services";
import {RuleSet} from "@/types/RuleSet";
import PField from "@/components/lib/forms/PField.vue";
import PSelect from "@/components/lib/forms/PSelect.vue";
import PTitle from "@/components/lib/PTitle.vue";
import PProse from "@/components/lib/PProse.vue";
import PDivider from "@/components/lib/PDivider.vue";
import PSimpleTable from "@/components/lib/table/PSimpleTable.vue";

export default defineComponent({
    name: "RulesAndPointsTable",
  components: {PSelect, PField, PTitle, PProse, PDivider, PSimpleTable},
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
    computed: {
        maxPosInRuleSet(): number {
            let max = 0;
            this.competition.availableSessions.forEach(session => {
                let map = this.ruleSet.data.pointsByEqualsPosition[session.id];
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
    async mounted() {
        seasonService.getSeasonList().then((seasons) => {
            this.seasonList = [];
            this.seasonList.push(...seasons);
        });

        this.competition = await competitionService.getCompetition(this.community.competition.id);
        this.chosenSeason = this.competition.currentSeason;

        this.getRuleSetOfSeason(this.community, this.chosenSeason);
    },
    methods: {
        changeSeason() {
            this.getRuleSetOfSeason(this.community, this.chosenSeason!);
        },
        async getRuleSetOfSeason(community: Community, season: Season) {
            const rules = await rulesetService.getRuleSetInSeason(community, season);
            this.ruleSet = rules;
        }
    }
})
</script>

<style scoped>

</style>
