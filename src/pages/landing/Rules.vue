<template>
  <PContainer
    size="xl"
    class="py-6"
  >
    <PCard>
      <PTitle
        tag="h1"
        type="title"
      >
        Reglas y normativa
      </PTitle>

      <PProse>
        <p>
          Cada Competición y Comunidad tendrán su normativa añadida a esta general, especificando reglas en los pronósticos o en el cálculo de resultados y puntuaciones.
        </p>

        <h2>Generales</h2>
        <ul>
          <li>Se sancionará el abuso de posibles errores en beneficio propio que permitan, por ejemplo, pronosticar fuera de plazo o visualizar datos que deberían estar ocultos. En caso de encontrarse uno de estos errores, el usuario deberá avisar a un administrador de la plataforma.</li>
          <li><b>PrognoSports</b> no permite la apología de odio en los nicks de usuarios, fotos de perfil, biografía o cualquier otro campo de la plataforma.</li>
        </ul>

        <template v-if="competition.id !== 0">
          <h2>Competición {{ competition.name }}</h2>
          <div v-html="compiledRules" />
        </template>
      </PProse>

      <section
        v-if="currentCommunity && competition.id !== 0"
        class="mt-6"
      >
        <PTitle
          tag="h2"
          type="subtitle"
        >
          Normas y puntuaciones de la comunidad {{ currentCommunity.name }}
        </PTitle>
        <RulesAndPointsTable :community="currentCommunity" />
      </section>

      <PProse class="mt-6">
        <p>
          Más enlaces de interés: <router-link :to="{name: 'terms'}">
            Términos y Condiciones
          </router-link> · <router-link :to="{name: 'privacy'}">
            Políticas de Privacidad
          </router-link>
        </p>
      </PProse>
    </PCard>
  </PContainer>
</template>

<script lang="ts">
import {Competition} from "@/types/Competition";
import {marked} from 'marked';
import {competitionService, seasonService} from "@/_services";
import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import {Season} from "@/types/Season";
import RulesAndPointsTable from "@/components/communities/RulesAndPointsTable.vue";
import PCard from "@/components/lib/PCard.vue";
import PContainer from "@/components/lib/PContainer.vue";
import PTitle from "@/components/lib/PTitle.vue";
import PProse from "@/components/lib/PProse.vue";

export default defineComponent({
    name: "Rules",
    components: {
    PContainer,
    PTitle,
    PProse,PCard, RulesAndPointsTable},
    setup() {
        const authStore = useAuthStore();
        const communityStore = useCommunityStore();

        const currentUser = authStore.loggedUser;
        const thereIsCurrentCommunity = communityStore.thereIsCurrentCommunity;
        const currentCommunity = communityStore.currentCommunity;

        return { currentUser, currentCommunity, thereIsCurrentCommunity };
    },
    data() {
        return {
            competition: {id: 0} as Competition,
            compiledRules: "",
            chosenSeason: {id: 0} as Season,
            seasonList: new Array<Season>(),
        }
    },
    mounted() {
        if (this.thereIsCurrentCommunity) {
            seasonService.getSeasonList().then((seasons) => {
                this.seasonList = [];
                this.seasonList.push(...seasons);
            });
            competitionService.getCompetition(this.currentCommunity.competition.code).then(c => {
                this.competition = c;
                this.chosenSeason = c.currentSeason;
                this.compiledRules = marked(c.rules ?? "");
            });
        }
    },
});
</script>
