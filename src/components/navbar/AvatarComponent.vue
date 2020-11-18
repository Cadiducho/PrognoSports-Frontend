<template>
    <div id="avatarComponent" class="navbar-item has-dropdown is-hoverable">
        <!-- ToDo: Imagen de perfil -->
        <a class="navbar-link">
            {{ user.username }}
        </a>

        <div class="navbar-dropdown">
            <a class="navbar-item disabled">
                {{user.email}} <!--ToDo: Esto pequeño y disabled-->
            </a>
            <hr class="navbar-divider">

            <router-link class="navbar-item" :to="'/u/' + user.id">
                Mi perfil
            </router-link>
            <router-link class="navbar-item" to="/settings">
                Ajustes
            </router-link>
            <hr class="navbar-divider">
            <a class="navbar-item" @click="logout()">
                Cerrar sesión
            </a>
        </div>
    </div>
</template>

<script lang="ts">

import {Component, Prop, Vue} from "vue-property-decorator";
    import {User} from "@/types/User";

    @Component
    export default class AvatarComponent extends Vue {
        @Prop() private user!: User;

        logout() {
            this.$router.push('/logout');
        }
    }
</script>