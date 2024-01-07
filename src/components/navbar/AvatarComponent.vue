<template>
    <div id="avatarComponent" class="navbar-item has-dropdown is-hoverable" v-if="currentUser">

        <a class="navbar-link nav-tag">
            <figure class="image is-32x32 avatar-figure">
                <img class="avatar" :src="currentUser.profileImage()" alt="Profile image">
            </figure>
            {{ currentUser.username }}
        </a>

        <div class="navbar-dropdown is-right">
            <a class="navbar-item is-disabled">
                {{ currentUser.email }}
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

<script setup lang="ts">

import { useAuth } from "@/composables/useAuth";
import { useAuthStore } from "@/store/authStore";
const auth = useAuth();
const authStore = useAuthStore();

const currentUser = authStore.loggedUser;

const logout = async () => {
    await auth.logout();
};
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