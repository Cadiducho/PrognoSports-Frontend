<template>
    <div id="adminConstructor" class="box">
        <PrognoPageTitle class="mb-5" name="Administración de Constructores" />

        <section v-if="isAdmin(currentUser)">

            <div class="block">
                <o-button variant="link" to="/new/constructor" tag="router-link">Nuevo constructor</o-button>
            </div>

            <o-field>
                <o-input
                    v-model="filtroTeam"
                    placeholder="Buscar constructor"
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

                <o-table-column field="name" label="Nombre" sortable v-slot="props">
                    {{ props.row.name }}
                </o-table-column>

                <o-table-column label="Actions" v-slot="props">
                    <span class="tags">
                        <span class="tag is-link">Ver</span>
                        <span class="tag is-warning">Editar</span>
                        <span class="tag is-danger">Eliminar</span>
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
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import {constructorService} from "@/_services";
import {Constructor} from "@/types/Constructor";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";

export default defineComponent({
    name: "LandingNavbar",
    components: {
        AlertNoPermission,
        PrognoPageTitle,
    },
    setup() {
        const authStore = useAuthStore();

        const currentUser = authStore.user;
        return { currentUser };
    },
    data() {
        return {
            isPaginated: true,
            filtroTeam: '',

            constructors: new Array<Constructor>(),
        }
    },
    mounted() {
        constructorService.getAllConstructors().then((constructors) => {
            this.constructors = [];
            this.constructors.push(...constructors);
        })
    },
    computed: {
        filteredDrivers(): Array<Constructor> {
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
});
</script>