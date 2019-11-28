<template>
    <div id="avatarComponent">
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

<script>
    import {AUTH_LOGOUT} from "@/_store/actions/auth";

    export default {
        name: "AvatarComponent",
        props: ['profile'],
        methods: {
            logout: function () {
                this.$store.dispatch(AUTH_LOGOUT).then(() => this.$router.push('/login'))
            },
        }
    }
</script>