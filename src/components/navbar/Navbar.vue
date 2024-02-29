<template>
    <div id="navbarComponent">
        <nav class="navbar is-light" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <router-link class="navbar-item" to="/" @click="clickEasterEgg()">
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
                <div v-if="isLoggedIn" class="navbar-start">
                    <router-link class="navbar-item" to="/gps">
                        Grandes Premios
                    </router-link>
                    <router-link class="navbar-item" to="/circuits">
                        Circuitos
                    </router-link>
                    <router-link class="navbar-item" to="/ranking">
                        Ranking
                    </router-link>
                    <router-link v-if="currentUser.isAdmin()" class="navbar-item" to="/admin">
                        Admin
                    </router-link>
                </div>

                <div v-if="!isLoggedIn" class="navbar-end">
                    <div class="navbar-item">
                        <div class="buttons">
                            <router-link class="button is-primary" to="/register">
                                <strong>Registrarse</strong>
                            </router-link>
                            <router-link class="button is-primary is-outlined" to="/login">
                                Iniciar sesión
                            </router-link>
                        </div>
                    </div>
                </div>

                <div v-if="isLoggedIn" class="navbar-end" >
                    <CommunitiesDropdown v-if="thereIsCurrentCommunity"/>
                    <AddElementsDropdown />
                    <AvatarComponent/>
                    <SwitchTheme v-if="darkModeActivable"/>
                </div>
            </div>
        </nav>
    </div>
</template>

<script lang="ts">
    import AvatarComponent from "@/components/navbar/AvatarComponent.vue";
    import CommunitiesDropdown from "@/components/navbar/CommunitiesDropdown.vue";
    import AddElementsDropdown from "@/components/navbar/AddElementsDropdown.vue";
    import {defineComponent} from "vue";
    import {useAuthStore} from "@/store/authStore";
    import {useCommunityStore} from "@/store/communityStore";
    import SwitchTheme from "@/components/navbar/SwitchTheme.vue";

    export default defineComponent({
        name: "Navbar",
        components: {SwitchTheme, CommunitiesDropdown, AvatarComponent, AddElementsDropdown},
        setup() {
            const authStore = useAuthStore();
            const communityStore = useCommunityStore();

            const isLoggedIn = authStore.isLoggedIn;
            const currentUser = authStore.loggedUser;
            const thereIsCurrentCommunity = communityStore.thereIsCurrentCommunity;
            const currentCommunity = communityStore.currentCommunity;
            return {isLoggedIn, currentUser, currentCommunity, thereIsCurrentCommunity};
        },
        data() {
            return {
                isOpen: false,
                counter: 0,
                darkModeActivable: localStorage.getItem('dark-mode') ?? false,
            }
        },
        methods: {
            clickEasterEgg() {
                this.counter++;
                if (this.counter >= 33) {
                    this.darkModeActivable = true;
                    localStorage.setItem('dark-mode', true)
                }
            }
        }
    });
</script>