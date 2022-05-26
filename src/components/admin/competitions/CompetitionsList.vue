<template>
    <div id="adminDrivers" class="box">
        <PrognoPageTitle class="mb-5" name="Administración de competiciones" />

        <section v-if="isAdmin(currentUser)">

            <div class="block">
                <o-button variant="link" to="/new/competition" tag="router-link">Nueva competición</o-button>
            </div>

            <o-field>
                <o-input
                    v-model="filtroCompetition"
                    placeholder="Buscar competition"
                    type="search"
                    icon-pack="fas"
                    icon="search"
                ></o-input>
            </o-field>

            <div class="block">
                <o-switch v-model="isPaginated">Paginated</o-switch>
            </div>

            <o-table :data="filteredCompetitions"
                    hoverable striped
                     :paginated="isPaginated"
                     per-page="15">

                <o-table-column field="id" label="ID" width="40" sortable numeric v-slot="props">
                    {{ props.row.id }}
                </o-table-column>

                <o-table-column field="code" label="Code" sortable v-slot="props">
                    {{ props.row.code }}
                </o-table-column>

                <o-table-column field="name" label="Name" sortable v-slot="props">
                    {{ props.row.name }}
                </o-table-column>

                <o-table-column field="fullname" label="Full Name" sortable v-slot="props">
                        {{ props.row.fullname }}
                </o-table-column>

                <o-table-column field="currentSeason.id" label="Temporada actual" sortable v-slot="props">
                    <template v-if="props.row.currentSeason">
                        {{ props.row.currentSeason.name }} (#{{ props.row.currentSeason.id }})
                    </template>
                    <template v-else>
                        <span class="tag is-info">No establecida</span>
                    </template>
                </o-table-column>

                <o-table-column label="Actions" v-slot="props">
                    <span class="tags">
                        <router-link class="tag is-warning" :to="'/admin/competitions/' + props.row.id">Editar</router-link>
                        <span class="tag is-danger" @click="confirmDeleteSeason(props.row)">Eliminar</span>
                    </span>
                </o-table-column>

            </o-table>

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
import {competitionService} from "@/_services";
import {Competition} from "@/types/Competition";
const Auth = namespace('Auth')

@Component({
        components: {
            AlertNoPermission,
            PrognoPageTitle,
        }
    }
)
export default class CompetitionsList extends Vue {
    @Auth.State("user") private currentUser!: User;

    private isPaginated: boolean = true;
    private filtroCompetition: String = '';

    private competitions: Array<Competition> = [];

    mounted() {
        competitionService.getCompetitionList().then((competitions) => {
            this.competitions = [];
            this.competitions.push(...competitions);
        })
    }

    get filteredCompetitions(): Array<Competition> {
        if (!this.filtroCompetition.trim()) {
            return this.competitions;
        }

        const filtroLowerCase: string = this.filtroCompetition.toLowerCase().trim();

        return this.competitions.filter((competition) => {
            return (
                competition.id
                    .toString()
                    .includes(filtroLowerCase) ||
                competition.name
                    .toLowerCase()
                    .includes(filtroLowerCase) ||
                competition.code
                    .toLowerCase()
                    .includes(filtroLowerCase) ||
                competition.fullname
                    .toLowerCase()
                    .includes(filtroLowerCase)
            );
        });
    }

    private confirmDeleteSeason(competition: Competition) {
        this.$oruga.dialog.confirm({
            title: 'Eliminar competición',
            message: `¿Estás seguro de que quieres <b>eliminar</b> la competición ${competition.name} (#${competition.id})? <br/>Esta acción se puede deshacer.`,
            confirmText: 'Eliminar competición',
            type: 'is-danger',
            hasIcon: true,
            onConfirm: () => this.deleteCompetition(competition),
        })
    }

    private deleteCompetition(competition: Competition) {
        competitionService.deleteCompetition(competition).then((ok) => {

            // Elimino de la lista y por lo tanto de la tabla
            this.competitions.splice(this.competitions.findIndex(s => s.id === competition.id),1);

            this.$oruga.notification.open({
                message: `Se ha eliminado correctamente la competition ${competition.name} (#${competition.id})`,
                variant: "danger",
            });
        }).catch((error) => {
            this.$oruga.notification.open({
                message: error.message,
                variant: "danger",
            });
        });
    }
}
</script>