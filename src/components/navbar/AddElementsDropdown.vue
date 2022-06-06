<template>
    <div id="addElementsDropdown" class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-item nav-tag" slot="trigger" role="button">
            <span class="icon">
                <i class="material-icons display-inline-block align-middle">add</i>
            </span>
        </a>

        <div class="navbar-dropdown is-right">
            <router-link class="navbar-item" to="/new/community">
                Crear Comunidad
            </router-link>
            <template v-if="isAdmin(currentUser)">
                <hr class="navbar-divider">
                <router-link class="navbar-item" to="/new/circuit">
                    Crear Circuito
                </router-link>
                <router-link class="navbar-item" to="/new/driver">
                    Crear Piloto
                </router-link>
                <router-link class="navbar-item" to="/new/season">
                    Crear Temporada
                </router-link>
                <router-link class="navbar-item" to="/new/gp">
                    Crear Gran Premio
                </router-link>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import {useAuthStore} from "@/pinia/authStore";
import {defineComponent} from "vue";

export default defineComponent({
    name: "AddElementsDropdown",
    setup() {
        const authStore = useAuthStore();

        const currentUser = authStore.user;
        return {currentUser};
    },
});
</script>