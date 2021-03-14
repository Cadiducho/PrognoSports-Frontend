<template>
    <div>
        <span class="title is-5">Puntuaciones de {{ sessionName }} </span> <br/>
        <span class="title is-6">Leyenda</span>
        <p class="content">
            Tus puntuaciones salen reflejadas con color <b-tag type="is-primary">verde</b-tag> <br/>
            El ganador de la sesión es reflejado con color <b-tag type="is-warning">dorado</b-tag>
        </p>
        <b-table :data="data"
                 hoverable
                 mobile-cards
                 default-sort="score.total"
                 default-sort-direction="DESC"
                 :row-class="(row, index) => checkRowClass(row, index)"
        >
            <b-table-column field="id" label="Nombre" sortable v-slot="props">
                {{ props.row.user.username }}
            </b-table-column>

            <b-table-column v-for="(driver, index) in results" v-bind:key="driver" :field="driver" :label="[index + 1] + '. ' + driver" v-slot="props">
                {{ props.row.results[index + 1] }}
            </b-table-column>

            <!-- Desactivado debido a que al usar custom headers, desaparece el icono de ordenación
            <b-table-column field="score.session" label="SES" numeric centered sortable>

                <template v-slot:header="{ column }">
                    <b-tooltip :label="'Sesión de ' + sessionName" append-to-body>
                        SES
                    </b-tooltip>
                </template>
                <template v-slot="props">
                    {{ props.row.score.session }}
                </template>
            </b-table-column>

            <b-table-column field="score.gp" label="GP" numeric centered sortable>
                <template v-slot:header="{ column }">
                    <b-tooltip label="En el Gran Premio" append-to-body>
                        GP
                    </b-tooltip>
                </template>
                <template v-slot="props">
                    {{ props.row.score.gp }}
                </template>
            </b-table-column>

            <b-table-column field="score.total" label="TOT" numeric centered sortable>
                <template v-slot:header="{ column }">
                    <b-tooltip label="En total en la Temporada" append-to-body>
                        TOT
                    </b-tooltip>
                </template>
                <template v-slot="props">
                    {{ props.row.score.total }}
                </template>
            </b-table-column> -->


            <b-table-column field="score.session" label="SES" sortable numeric v-slot="props">
                {{ props.row.score.session }}
            </b-table-column>
            <b-table-column field="score.gp" label="GP" sortable numeric v-slot="props">
                {{ props.row.score.gp }}
            </b-table-column>
            <b-table-column field="score.total" label="TOT" sortable numeric v-slot="props">
                {{ props.row.score.total }}
            </b-table-column>
        </b-table>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {User} from "@/types/User";
import {namespace} from "vuex-class";
import {RaceSession} from "@/types/RaceSession";
const Auth = namespace('Auth')

@Component
export default class ScoreComponents extends Vue {
    @Prop({required: true}) session!: RaceSession;
    @Auth.State("user") private currentUser!: User;
    private winnerUser = { username: 'Jorgue'};

    results = ['HAM', 'VET', 'BOT', 'ALO'];
    data = [
        { 'id': 1, 'user': {'username': 'Cadiducho'}, 'results': {'1': 'HAM', '2': 'BOT', '3': 'VET', '4': 'OCO'}, 'score': {'session': 15, 'gp': 42, 'total': 105} },
        { 'id': 2, 'user': {'username': 'Kevin'}, 'results': {'1': 'HAM', '2': 'BOT', '3': 'SAI', '4': 'OCO'}, 'score': {'session': 2, 'gp': 42, 'total': 90} },
        { 'id': 3, 'user': {'username': 'Jorgue'}, 'results': {'1': 'HAM', '2': 'BOT', '3': 'VET', '4': 'RIC'}, 'score': {'session': 1, 'gp': 37, 'total': 108} },
        { 'id': 4, 'user': {'username': 'Aleix'}, 'results': {'1': 'HAM', '2': 'VER', '3': 'BOT', '4': 'OCO'}, 'score': {'session': 7, 'gp': 45, 'total': 71} },
        { 'id': 5, 'user': {'username': 'Bot1'}, 'results': {'1': 'HAM', '2': 'OCO', '3': 'BOT', '4': 'VET'}, 'score': {'session': 10, 'gp': 25, 'total': 48} },
    ];

    private checkRowClass(row: any, index: number) {
        if (row.user.username === this.winnerUser.username) return 'is-winner';
        if (row.user.username === this.currentUser.username) return 'is-user';
        return '';
    }

    get sessionName() {
        return this.session == "RACE" ? "Carrera" : "Clasificación";
    }
}
</script>

<style lang="scss">
@import "~bulma/sass/utilities/_all";

tr.is-user {
    background: $primary;
    &:not(:hover) {
        color: #fff;
    }
}

tr.is-winner {
    background: $warning;
}
</style>