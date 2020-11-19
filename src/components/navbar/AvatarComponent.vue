<template>
    <div id="avatarComponent" class="navbar-item has-dropdown is-hoverable">

        <a class="navbar-link nav-tag">
            <figure class="image is-32x32 avatar-figure">
                <img class="avatar" :src="user.profileImageUrl">
            </figure>
            {{ user.username }}
        </a>

        <div class="navbar-dropdown is-right">
            <a class="navbar-item is-disabled">
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