<template>
    <div id="seasonList" class="box">
        <PrognoPageTitle class="mb-5" name="Administración de temporadas" />

        <section v-if="isAdmin(currentUser.rank)">

            <div class="block">
                <b-button type="is-link" to="/new/season" tag="router-link">Nueva temporada</b-button>
            </div>

            <b-field>
                <b-input
                    v-model="filtroSeason"
                    placeholder="Buscar temporada"
                    type="search"
                    icon-pack="fas"
                    icon="search"
                ></b-input>
            </b-field>

            <div class="block">
                <b-switch v-model="isPaginated">Paginated</b-switch>
            </div>

            <b-table :data="filteredSeasons"
                    hoverable striped
                     :paginated="isPaginated"
                     per-page="15">

                <b-table-column field="id" label="ID" width="40" sortable numeric v-slot="props">
                    {{ props.row.id }}
                </b-table-column>

                <b-table-column field="competition.name" label="Competición" sortable v-slot="props">
                    {{ props.row.competition.name }}
                </b-table-column>

                <b-table-column field="name" label="Name" sortable v-slot="props">
                    {{ props.row.name }}
                </b-table-column>

                <b-table-column field="totalEvents" label="Total Events" sortable numeric v-slot="props">
                        {{ props.row.totalEvents }}
                </b-table-column>

                <b-table-column label="Actions" v-slot="props">
                    <span class="tags">
                        <router-link class="tag is-warning" :to="'/admin/seasons/' + props.row.id">Editar</router-link>
                        <span class="tag is-danger" @click="confirmDeleteSeason(props.row)">Eliminar</span>
                    </span>
                </b-table-column>

            </b-table>

        </section>
        <section v-else>
            <AlertNoPermission />
        </section>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import {User} from "@/types/User";
import {namespace} from "vuex-class";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import {seasonService} from "@/_services";
import {Season} from "@/types/Season";
import TableList from "@/components/admin/PrognoTableList.vue";
const Auth = namespace('Auth')

@Component({
        components: {
            TableList,
            AlertNoPermission,
            PrognoPageTitle,
        }
    }
)
export default class SeasonsList extends Vue {
    @Auth.State("user") private currentUser!: User;

    private isPaginated: boolean = true;
    private filtroSeason: String = '';

    private seasons: Array<Season> = [];

    mounted() {
        seasonService.getSeasonList().then((seasons) => {
            this.seasons = [];
            this.seasons.push(...seasons);
        })
    }

    get filteredSeasons(): Array<Season> {
        if (!this.filtroSeason.trim()) {
            return this.seasons;
        }

        const filtroLowerCase: string = this.filtroSeason.toLowerCase().trim();

        return this.seasons.filter((season) => {
            return (
                season.id
                    .toString()
                    .includes(filtroLowerCase) ||
                season.name
                    .toLowerCase()
                    .includes(filtroLowerCase) ||
                season.competition.name
                    .toLowerCase()
                    .includes(filtroLowerCase) ||
                season.competition.code
                    .toLowerCase()
                    .includes(filtroLowerCase)
            );
        });
    }

    private confirmDeleteSeason(season: Season) {
        this.$buefy.dialog.confirm({
            title: 'Eliminar temporada',
            message: `¿Estás seguro de que quieres <b>eliminar</b> la temporada ${season.name} (#${season.id})? <br/>Esta acción se puede deshacer.`,
            confirmText: 'Eliminar temporada',
            type: 'is-danger',
            hasIcon: true,
            onConfirm: () => this.deleteSeason(season),
        })
    }

    private deleteSeason(season: Season) {
        seasonService.deleteSeason(season).then((ok) => {

            // Elimino de la lista y por lo tanto de la tabla
            this.seasons.splice(this.seasons.findIndex(s => s.id === season.id),1);

            this.$buefy.toast.open({
                message: `Se ha eliminado correctamente la temporada ${season.name} (#${season.id})`,
                type: "is-danger",
            });
        }).catch((error) => {
            this.$buefy.toast.open({
                message: error.message,
                type: "is-danger",
            });
        });
    }
}
</script>