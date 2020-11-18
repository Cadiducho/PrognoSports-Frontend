<template>
    <div id="navbarComponent">
        <nav class="navbar is-light" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <router-link class="navbar-item" to="/">
                    <img src="@/assets/logo.png" class="navbar-brand-image d-inline-block align-top mr-2" alt="">
                    PrognoSports
                </router-link>

                <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbar" class="navbar-menu">
                <div class="navbar-start">
                    <router-link class="navbar-item" to="/gps">
                        Grandes Premios
                    </router-link>

                    <router-link class="navbar-item" to="/ranking">
                        Ranking
                    </router-link>
                </div>

                <div class="navbar-end">
                    <div class="navbar-item has-dropdown is-hoverable">
                        <a class="navbar-link">
                            Comunidad
                        </a>

                        <div class="navbar-dropdown">
                            <a class="navbar-item">
                                PrognoSports
                            </a>
                            <hr class="navbar-divider">
                            <router-link class="navbar-item" to="/communities">
                                Todas las comunidades
                            </router-link>
                        </div>
                    </div>
                    <div class="navbar-item">
                        <div class="field is-grouped">
                            <span class="icon">
                                <i class="material-icons display-inline-block align-middle">notifications_none</i>
                            </span>
                        </div>
                    </div>

                    <AvatarComponent :user="getProfile"/>
                </div>
            </div>
        </nav>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import AvatarComponent from "@/components/navbar/AvatarComponent.vue";
    import NotificationsDropdown from "@/components/navbar/NotificationsDropdown.vue";
    import CommunitiesDropdown from "@/components/navbar/CommunitiesDropdown.vue";
    import {Community} from "@/types/Community";
    import {CommunityModule} from "@/_store/modules/CommunityModule";
    import {AuthModule} from "@/_store/modules/AuthModule";
    import {User} from "@/types/User";
    import {namespace} from 'vuex-class'

    const usermodule = namespace('user')
    @Component({
        components: {
            CommunitiesDropdown,
            NotificationsDropdown,
            AvatarComponent
        }
    })
    export default class Navbar extends Vue {
        @usermodule.Getter private getProfile?: User;

        private currentCommunity: Community = CommunityModule.currentCommunity;
        private isAuthenticated: boolean = AuthModule.isAuthenticated;
        private authStatus: string = AuthModule.authStatus;

        public logout() {
            AuthModule.logout().then(() => this.$router.push('/login'));
        }
    }
</script>