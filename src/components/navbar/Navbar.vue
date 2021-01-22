<template>
    <div id="navbarComponent">
        <nav class="navbar is-light" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <router-link class="navbar-item" to="/">
                    <img src="@/assets/logo.png" class="navbar-brand-image d-inline-block align-top mr-3" alt="">

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
                    <CommunitiesDropdown/>
                    <NotificationsDropdown />
                    <AvatarComponent/>
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
    import {User} from "@/types/User";
    import {namespace} from 'vuex-class'
    const Auth = namespace("Auth");

    @Component({
        components: {
            CommunitiesDropdown,
            NotificationsDropdown,
            AvatarComponent
        }
    })
    export default class Navbar extends Vue {
        @Auth.State("user") private currentUser!: User;
        @Auth.Action private signOut!: () => Promise<void>;
        @Auth.Getter private currentCommunity?: Community;

        public logout() {
            this.signOut().then(() => this.$router.push('/login'));
        }
    }
</script>