<template>
    <div id="adminDrivers" class="box">
        <PrognoPageTitle class="mb-5" name="Administración de pilotos" />

        <section v-if="isAdmin(currentUser.rank)">

            <div class="block">
                <b-button type="is-link" to="/new/driver" tag="router-link">Nuevo piloto</b-button>
            </div>

            <b-field>
                <b-input
                    v-model="filtroPiloto"
                    placeholder="Buscar piloto"
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

                <b-table-column field="first_name" label="First Name" sortable v-slot="props">
                    {{ props.row.firstname }}
                </b-table-column>

                <b-table-column field="last_name" label="Last Name" sortable v-slot="props">
                    {{ props.row.lastname }}
                </b-table-column>

                <b-table-column field="code" label="Code" sortable v-slot="props" width="60">
                    <span class="tag is-primary is-rounded">
                        {{ props.row.code }}
                    </span>
                </b-table-column>

                <b-table-column field="nationality" label="Nationality" sortable v-slot="props">
                    {{ props.row.nationality }}
                </b-table-column>

                <b-table-column field="birth" label="Birth" centered sortable v-slot="props">
                    <span class="tag is-success" v-if="props.row.birth">
                        {{ props.row.birth | humanDate }}
                    </span>
                    <span class="tag is-warning" v-else>
                        Sin fecha
                    </span>
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
import {driversService} from "@/_services";
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
    private filtroPiloto: String = '';

    private drivers: Array<Driver> = [];

    mounted() {
        driversService.getAllDrivers().then((drivers) => {
            this.drivers = [];
            this.drivers.push(...drivers);
        })
    }

    get filteredDrivers(): Array<Driver> {
        if (!this.filtroPiloto.trim()) {
            return this.drivers;
        }

        const filtroLowerCase: string = this.filtroPiloto.toLowerCase().trim();

        return this.drivers.filter((driver) => {
            return (
                driver.id
                    .toLowerCase()
                    .includes(filtroLowerCase) ||
                driver.lastname
                    .toLowerCase()
                    .includes(filtroLowerCase) ||
                driver.firstname
                    .toLowerCase()
                    .includes(filtroLowerCase) ||
                driver.code
                    .toLowerCase()
                    .includes(filtroLowerCase) ||
                driver.nationality
                    .toLowerCase()
                    .includes(filtroLowerCase)
            );
        });
    }
}
</script>