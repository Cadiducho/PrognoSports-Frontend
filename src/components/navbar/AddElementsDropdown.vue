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
import {Component, Vue} from "vue-property-decorator";
import {namespace} from "vuex-class";
import {User} from "@/types/User";
const Auth = namespace('Auth')

@Component
export default class AddElementsDropdown extends Vue {
    @Auth.State("user") private currentUser!: User;

}
</script>