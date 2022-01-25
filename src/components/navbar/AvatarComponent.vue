<template>
    <div id="avatarComponent" class="navbar-item has-dropdown is-hoverable">

        <a class="navbar-link nav-tag">
            <figure class="image is-32x32 avatar-figure">
                <img class="avatar" :src="userProfileImage(currentUser)" alt="Profile image">
            </figure>
            {{ currentUser.username }}
        </a>

        <div class="navbar-dropdown is-right">
            <a class="navbar-item is-disabled">
                {{currentUser.email}}
            </a>
            <hr class="navbar-divider">

            <router-link class="navbar-item" :to="'/u/' + currentUser.id">
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

    import {Component, Vue} from "vue-property-decorator";
    import {User} from "@/types/User";
    import {namespace} from "vuex-class";
    const Auth = namespace('Auth')

    @Component
    export default class AvatarComponent extends Vue {
        @Auth.State("user") private currentUser!: User;

        logout() {
            this.$router.push('/logout');
        }
    }
</script>

<style scoped>
.navbar-item.is-disabled,
.navbar-item.is-disabled a {
    color: #7a7a7a;
    pointer-events: none;
    cursor: default;
    font-size: .72rem;
}
</style>