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

        <section class="content" v-if="currentCommunity && currentCommunity.competition">
            <h2>Competición {{ currentCommunity.competition.name }}</h2>
            <section>
                <p v-html="compiledRules"></p>
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
import { marked } from 'marked';
import {Community} from "@/types/Community";
import {User} from "@/types/User";
import {competitionService} from "@/_services";

const Auth = namespace("Auth");

@Component
export default class RulesComponent extends Vue {

    @Auth.State("user") private currentUser!: User;
    @Auth.State("community") private currentCommunity!: Community;
    private competition!: Competition;
    private compiledRules: string = "";

    mounted() {
        competitionService.getCompetition(this.currentCommunity.competition.code)
            .then(c => {
                this.competition = c;
                this.compiledRules = marked(c.rules ?? "");
            });
    }

    // ToDo: Obtener las normas correspondientes a la comunidad
}
</script>