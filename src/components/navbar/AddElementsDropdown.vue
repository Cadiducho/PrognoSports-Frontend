<template>
    <div id="addElementsDropdown" class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-item nav-tag" slot="trigger" role="button">
            <span class="icon">
                <i class="material-icons display-inline-block align-middle">add</i>
            </span>
        </a>

        <div class="navbar-dropdown is-right">
            <router-link class="navbar-item" :to="{name: 'communitiesCreate'}">
                Crear Comunidad
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
import {useAuthStore} from "@/store/authStore";
import {defineComponent} from "vue";

export default defineComponent({
    name: "AddElementsDropdown",
    setup() {
        const authStore = useAuthStore();

        const currentUser = authStore.loggedUser;
        return {currentUser};
    },
});
</script>