<template>
    <div id="navbarComponent">
        <nav class="navbar navbar-expand justify-content-between fixed-top">
            <router-link class="navbar-brand mb-0 h1 d-none d-md-block" to="/home">
                <img src="@/assets/logo.png" class="navbar-brand-image d-inline-block align-top mr-2" alt="">
                PrognoSports
            </router-link>

            <div class="d-flex flex-1 d-block d-md-none">
                <a href="#" class="sidebar-toggle ml-3">
                    <i class="material-icons">menu</i>
                </a>
            </div>

            <b-navbar-nav class="ml-auto">

                <CommunitiesDropdown :currentCommunity="currentCommunity" />

            </b-navbar-nav>
            <b-navbar-nav class="d-flex align-items-center justify-content-end mr-2">

                <NotificationsDropdown />

                <AvatarComponent :profile="profile" />

            </b-navbar-nav>
        </nav>
    </div>
</template>

<script>
    import { mapGetters, mapState } from 'vuex'
    import { AUTH_LOGOUT } from "@/_store/actions/auth";
    import AvatarComponent from "@/components/navbar/AvatarComponent";
    import NotificationsDropdown from "@/components/navbar/NotificationsDropdown";
    import CommunitiesDropdown from "@/components/navbar/CommunitiesDropdown";

    export default {
        components: {
            CommunitiesDropdown,
            NotificationsDropdown,
            AvatarComponent
        },
        name: 'navbar',
        methods: {
            logout: function () {
                this.$store.dispatch(AUTH_LOGOUT).then(() => this.$router.push('/login'))
            },
        },
        computed: {
            ...mapGetters(['isAuthenticated', 'authStatus']),
            ...mapState({
                profile: state => state.user.profile,
                currentCommunity: state => state.community.currentCommunity,
            }),
        },
        data () {
            return {}
        },
    }
</script>