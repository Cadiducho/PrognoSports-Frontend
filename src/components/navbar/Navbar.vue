<template>
    <div id="navbarComponent">
        <nav class="navbar is-light" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <router-link class="navbar-item" to="/">
                    <img src="@/assets/logo_navbar.png" class="mr-3 ml-2" alt="PrognoSports.com">

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

                <div class="navbar-end" v-if="currentUser">
                    <CommunitiesDropdown v-if="currentCommunity"/>
                    <NotificationsDropdown />
                    <AddElementsDropdown />
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
    import AddElementsDropdown from "@/components/navbar/AddElementsDropdown.vue";
    import {Community} from "@/types/Community";
    import {User} from "@/types/User";
    import {namespace} from 'vuex-class'
    const Auth = namespace("Auth");

    @Component({
        components: {
            CommunitiesDropdown,
            NotificationsDropdown,
            AvatarComponent,
            AddElementsDropdown
        }
    })
    export default class Navbar extends Vue {
        @Auth.State("user") private currentUser!: User;
        @Auth.State("community") private currentCommunity!: Community;
    }
</script>