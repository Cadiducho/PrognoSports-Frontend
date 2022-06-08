<template>
    <div id="adminPage" class="box">
        <PrognoPageTitle class="mb-5" name="Administración de PrognoSports" />

        <section v-if="isAdmin(currentUser)">
            <div class="columns">
                <div class="column">
                    <router-link class="box notification is-info has-text-centered has-text-weight-bold" to="/admin/users">
                        Administración de Usuarios
                    </router-link>
                </div>
                <div class="column">
                    <router-link class="box notification is-info has-text-centered has-text-weight-bold" to="/admin/communities">
                        Administración de Comunidades
                    </router-link>
                </div>
            </div>

            <div class="columns">

                <div class="column">
                    <router-link class="box notification is-link has-text-centered has-text-weight-bold" to="/admin/competitions">
                        Administración de Competiciones
                    </router-link>
                </div>

                <div class="column">
                    <router-link class="box notification is-link has-text-centered has-text-weight-bold" to="/admin/seasons">
                        Administración de Temporadas
                    </router-link>
                </div>

                <div class="column">
                    <router-link class="box notification is-link has-text-centered has-text-weight-bold" to="/admin/gps">
                        Administración de Grandes Premios
                    </router-link>
                </div>
            </div>

            <div class="columns">
                <div class="column">
                    <router-link class="box notification is-success has-text-centered has-text-weight-bold" to="/admin/drivers">
                        Administración de Pilotos
                    </router-link>
                </div>

                <div class="column">
                    <router-link class="box notification is-success has-text-centered has-text-weight-bold" to="/admin/constructors">
                        Administración de Equipos
                    </router-link>
                </div>

            </div>

            <div class="columns">
                <div class="column">
                    <router-link class="box notification is-success has-text-centered has-text-weight-bold" to="/admin/circuits">
                        Administración de Circuitos
                    </router-link>
                </div>
            </div>

            <div class="columns">
                <div class="column">
                    <router-link class="box notification is-success is-light has-text-centered has-text-weight-bold" to="/admin/stats">
                        Estadísticas
                    </router-link>
                </div>
                <div class="column">
                    <router-link class="box notification is-success is-light has-text-centered has-text-weight-bold" to="/admin/logs">
                        Logs
                    </router-link>
                </div>
            </div>
        </section>
        <section v-else>
            <AlertNoPermission />
        </section>
    </div>
</template>

<script lang="ts">
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";

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
});
</script>