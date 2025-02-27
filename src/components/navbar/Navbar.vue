<template>
  <div id="navbarComponent">
    <nav
      class="navbar is-light shadow"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <router-link
          class="navbar-item"
          to="/"
          @click="clickEasterEgg()"
        >
          <img
            src="@/assets/logo_navbar.png"
            class="mr-3 ml-2"
            alt="PrognoSports.com"
          >

          PrognoSports
        </router-link>

        <a
          role="button"
          class="navbar-burger"
          :class="{ 'is-active': isOpen }"
          aria-label="menu"
          aria-expanded="false"
          data-target="prognoNavbar"
          @click="isOpen = !isOpen"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </a>
      </div>

      <div
        id="prognoNavbar"
        class="navbar-menu"
        :class="{ 'is-active': isOpen }"
      >
        <div
          v-if="isLoggedIn"
          class="navbar-start"
        >
          <router-link
            class="navbar-item"
            to="/gps"
          >
            Grandes Premios
          </router-link>
          <router-link
            class="navbar-item"
            to="/circuits"
          >
            Circuitos
          </router-link>
          <router-link
            class="navbar-item"
            to="/ranking"
          >
            Ranking
          </router-link>
          <router-link
            v-if="currentUser.isAdmin()"
            class="navbar-item"
            to="/admin"
          >
            Admin
          </router-link>
        </div>

        <div
          v-if="!isLoggedIn"
          class="navbar-end"
        >
          <div class="navbar-item">
            <div class="buttons">
              <router-link
                class="button is-primary"
                to="/register"
              >
                <strong>Registrarse</strong>
              </router-link>
              <router-link
                class="button is-primary is-outlined"
                to="/login"
              >
                Iniciar sesión
              </router-link>
            </div>
          </div>
        </div>

        <div
          v-if="isLoggedIn"
          class="navbar-end"
        >
          <CommunitiesDropdown v-if="thereIsCurrentCommunity" />
          <SwitchTheme v-if="darkModeActivable" />
          <AvatarComponent />
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import AvatarComponent from "@/components/navbar/AvatarComponent.vue";
import CommunitiesDropdown from "@/components/navbar/CommunitiesDropdown.vue";
import {ref} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import SwitchTheme from "@/components/navbar/SwitchTheme.vue";

const authStore = useAuthStore();
const communityStore = useCommunityStore();

const isLoggedIn = authStore.isLoggedIn;
const currentUser = authStore.loggedUser;
const thereIsCurrentCommunity = communityStore.thereIsCurrentCommunity;;

const isOpen = ref(false);
const counter = ref(0);
const darkModeActivable = ref(localStorage.getItem('dark-mode') ?? false);

const clickEasterEgg = () => {
  counter.value++;
  if (counter.value >= 33) {
    darkModeActivable.value = true;
    localStorage.setItem('dark-mode', true)
  }
}
</script>
