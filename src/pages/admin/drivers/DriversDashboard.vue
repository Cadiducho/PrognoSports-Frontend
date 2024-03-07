<template>
    <div id="adminDrivers" class="box">
        <PTitle class="mb-5" name="Administración de pilotos"/>

        <div class="block">
            <o-button variant="link" :to="{name: 'driverCreate'}" tag="router-link">Nuevo piloto</o-button>
        </div>

        <o-field>
            <o-input
                v-model="filtroPiloto"
                placeholder="Buscar piloto"
                type="search"
                icon-pack="fas"
                icon="search"
            ></o-input>
        </o-field>

        <div class="block">
            <o-switch v-model="isPaginated">Paginated</o-switch>
        </div>

        <o-table :data="filteredDrivers"
                 hoverable striped
                 :paginated="isPaginated"
                 per-page="15">

            <o-table-column field="id" label="ID" width="40" sortable v-slot="props">
                {{ props.row.id }}
            </o-table-column>

            <o-table-column field="first_name" label="First Name" sortable v-slot="props">
                {{ props.row.firstname }}
            </o-table-column>

            <o-table-column field="last_name" label="Last Name" sortable v-slot="props">
                {{ props.row.lastname }}
            </o-table-column>

            <o-table-column field="code" label="Code" sortable v-slot="props" width="60">
                    <span class="tag is-primary is-rounded">
                        {{ props.row.code }}
                    </span>
            </o-table-column>

            <o-table-column field="nationality" label="Nationality" sortable v-slot="props">
                {{ props.row.nationality }}
            </o-table-column>

            <o-table-column field="birth" label="Birth" centered sortable v-slot="props">
                    <span class="tag is-success" v-if="props.row.birth">
                        {{ humanDate(props.row.birth) }}
                    </span>
                <span class="tag is-warning" v-else>
                        Sin fecha
                    </span>
            </o-table-column>

            <o-table-column label="Actions" v-slot="props">
                    <span class="tags">
                        <span class="tag is-link">Ver</span>
                        <span class="tag is-warning">Editar</span>
                        <span class="tag is-danger">Eliminar</span>
                    </span>
            </o-table-column>

        </o-table>
    </div>
</template>

<script lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import {Driver} from "@/types/Driver";
import {driversService} from "@/_services";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useDayjs} from "@/composables/useDayjs";

export default defineComponent({
    name: "DriversDashboard",
    components: {
        AlertNoPermission,
        PTitle,
    },
    setup() {
        const dayjs = useDayjs();
        const authStore = useAuthStore();

        const humanDate = dayjs.humanDate;
        const currentUser = authStore.loggedUser;
        return { currentUser, humanDate };
    },
    data() {
        return {
            isPaginated: true,
            filtroPiloto: '',
            drivers: new Array<Driver>(),
        }
    },
    mounted() {
        driversService.getAllDrivers().then((drivers) => {
            this.drivers = [];
            this.drivers.push(...drivers);
        })
    },
    computed: {
        filteredDrivers(): Array<Driver> {
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
});
</script>