<template>
    <div id="adminConstructor" class="box">
        <PrognoPageTitle class="mb-5" name="Administración de Constructores" />

        <section v-if="isAdmin(currentUser)">

            <div class="block">
                <b-button type="is-link" to="/new/constructor" tag="router-link">Nuevo constructor</b-button>
            </div>

            <b-field>
                <b-input
                    v-model="filtroTeam"
                    placeholder="Buscar constructor"
                    type="search"
                    icon-pack="fas"
                    icon="search"
                ></b-input>
            </b-field>

            <div class="block">
                <b-switch v-model="isPaginated">Paginated</b-switch>
            </div>

            <b-table :data="filteredDrivers"
                    hoverable striped
                     :paginated="isPaginated"
                     per-page="15">

                <b-table-column field="id" label="ID" width="40" sortable v-slot="props">
                    {{ props.row.id }}
                </b-table-column>

                <b-table-column field="name" label="Nombre" sortable v-slot="props">
                    {{ props.row.name }}
                </b-table-column>

                <b-table-column label="Actions" v-slot="props">
                    <span class="tags">
                        <span class="tag is-link">Ver</span>
                        <span class="tag is-warning">Editar</span>
                        <span class="tag is-danger">Eliminar</span>
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
import {Driver} from "@/types/Driver";
import {constructorService, driversService} from "@/_services";
import {Constructor} from "@/types/Constructor";
const Auth = namespace('Auth')

@Component({
        components: {
            AlertNoPermission,
            PrognoPageTitle,
        }
    }
)
export default class DriversAdmin extends Vue {
    @Auth.State("user") private currentUser!: User;

    private isPaginated: boolean = true;
    private filtroTeam: String = '';

    private constructors: Array<Constructor> = [];

    mounted() {
        constructorService.getAllConstructors().then((constructors) => {
            this.constructors = [];
            this.constructors.push(...constructors);
        })
    }

    get filteredDrivers(): Array<Constructor> {
        if (!this.filtroTeam.trim()) {
            return this.constructors;
        }

        const filtroLowerCase: string = this.filtroTeam.toLowerCase().trim();

        return this.constructors.filter((driver) => {
            return (
                driver.id
                    .toLowerCase()
                    .includes(filtroLowerCase) ||
                driver.name
                    .toLowerCase()
                    .includes(filtroLowerCase)
            );
        });
    }
}
</script>