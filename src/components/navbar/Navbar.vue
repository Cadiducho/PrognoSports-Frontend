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

                <CommunitiesDropdown />

            </b-navbar-nav>
            <b-navbar-nav class="d-flex align-items-center justify-content-end mr-2">

                <NotificationsDropdown />

                <AvatarComponent />

            </b-navbar-nav>
        </nav>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {namespace, State} from 'vuex-class'
    const user = namespace('user');
    const community = namespace('community');
    const auth = namespace('auth');

    import AvatarComponent from "@/components/navbar/AvatarComponent.vue";
    import NotificationsDropdown from "@/components/navbar/NotificationsDropdown.vue";
    import CommunitiesDropdown from "@/components/navbar/CommunitiesDropdown.vue";
    import AuthTypes from "@/_store/types/AuthTypes.ts";
    import {User} from "@/types/User";
    import {Community} from "@/types/Community";

    @Component({
        components: {
            CommunitiesDropdown,
            NotificationsDropdown,
            AvatarComponent
        }
    })
    export default class Navbar extends Vue {
        @State(state => state.user.profile) profile!: User;
        @State(state => state.community.currentCommunity) currentCommunity!: Community;
        @auth.Getter isAuthenticated!: boolean;
        @auth.Getter authStatus!: string;
        @auth.Action(AuthTypes.actions.AUTH_LOGOUT) actionLogout!: Promise<any>;

        public logout() {
            this.actionLogout.then(() => this.$router.push('/login'));
        }
    }
</script>