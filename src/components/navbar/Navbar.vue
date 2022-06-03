<template>
    <div id="navbarComponent">
        <nav class="navbar is-light" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <router-link class="navbar-item" to="/">
                    <img src="@/assets/logo_navbar.png" class="mr-3 ml-2" alt="PrognoSports.com">

                    PrognoSports
                </router-link>

                <a role="button" class="navbar-burger" :class="{ 'is-active': isOpen }" @click="isOpen = !isOpen"
                   aria-label="menu" aria-expanded="false" data-target="prognoNavbar">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="prognoNavbar" class="navbar-menu" :class="{ 'is-active': isOpen }">
                <div class="navbar-start">
                    <router-link class="navbar-item" to="/gps">
                        Grandes Premios
                    </router-link>
                    <router-link class="navbar-item" to="/circuits">
                        Circuitos
                    </router-link>
                    <router-link v-if="currentUser" class="navbar-item" to="/ranking">
                        Ranking
                    </router-link>
                    <router-link v-if="currentUser && isAdmin(currentUser)" class="navbar-item" to="/admin">
                        Admin
                    </router-link>
                </div>

                <div class="navbar-end" v-if="isValidUser(currentUser)">
                    <CommunitiesDropdown v-if="isValidCommunity(currentCommunity)"/>
                    <NotificationsDropdown />
                    <AddElementsDropdown />
                    <AvatarComponent/>
                </div>
            </div>
        </nav>
    </div>
</template>

<script lang="ts">
    import AvatarComponent from "@/components/navbar/AvatarComponent.vue";
    import NotificationsDropdown from "@/components/navbar/NotificationsDropdown.vue";
    import CommunitiesDropdown from "@/components/navbar/CommunitiesDropdown.vue";
    import AddElementsDropdown from "@/components/navbar/AddElementsDropdown.vue";
    import {defineComponent} from "vue";
    import {useAuthStore} from "@/pinia/authStore";
    import {useCommunityStore} from "@/pinia/communityStore";

    export default defineComponent({
        name: "Navbar",
        components: {CommunitiesDropdown, NotificationsDropdown, AvatarComponent, AddElementsDropdown},
        setup() {
            const authStore = useAuthStore();
            const communityStore = useCommunityStore();

            const currentUser = authStore.user;
            const currentCommunity = communityStore.community;
            return {currentUser, currentCommunity};
        },
        data() {
            return {
                isOpen: false,
            }
        }
    });
</script>