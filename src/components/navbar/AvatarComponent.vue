<template>
    <div id="avatarComponent" v-if="profile !== undefined">
        <b-nav-item-dropdown right no-caret class="navbar-avatar">
            <template v-slot:button-content>
                <img :src="profile.profileImageUrl" class="rounded-circle d-inline-block align-top dropdown-toggle-no-caret" alt="">
            </template>
            <b-dropdown-item disabled>{{profile.username}}</b-dropdown-item>
            <b-dropdown-header>{{profile.email}}</b-dropdown-header>
            <b-dropdown-divider />
            <b-dropdown-item :to="'/u/' + profile.id">Mi perfil</b-dropdown-item>
            <b-dropdown-item to="/settings">Ajustes</b-dropdown-item>
            <b-dropdown-divider />
            <b-dropdown-item variant="danger" @click="logout">Cerrar sesión</b-dropdown-item>
        </b-nav-item-dropdown>
    </div>
</template>

<script lang="ts">

    import {Component, Vue} from "vue-property-decorator";
    import {User} from "@/types/User";
    import {UserModule} from "@/_store/modules/UserModule";
    import {AuthModule} from "@/_store/modules/AuthModule";

    @Component
    export default class AvatarComponent extends Vue {
        private profile: User = UserModule.profile;

        logout() {
            AuthModule.logout().then(() => this.$router.push('/login'));
        }
    }
</script>