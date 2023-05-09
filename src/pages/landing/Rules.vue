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
            <RulesAndPointsTable :community="currentCommunity" />
        </section>

        <p class="content">
            Más enlaces de interés: <router-link :to="{name: 'terms'}">Términos y Condiciones</router-link> · <router-link :to="{name: 'privacy'}">Políticas de Privacidad</router-link>
        </p>
    </div>
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

export default defineComponent({
    name: "Rules",
    components: {RulesAndPointsTable},
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
