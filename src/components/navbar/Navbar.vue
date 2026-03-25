<template>
  <div id="navbarComponent">
    <nav
      class="border-b border-gray-200 bg-white shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-900"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="w-full px-3 sm:px-4 lg:px-6">
        <div class="md:flex md:h-14 md:items-center">
          <div class="flex h-14 items-center justify-between md:h-auto md:flex-shrink-0">
            <router-link
              class="inline-flex items-center rounded-md px-2 py-1 text-base font-semibold text-gray-800 transition-colors hover:text-primary dark:text-gray-100"
              to="/"
              @click="clickEasterEgg()"
            >
              <img
                src="@/assets/logo_navbar.png"
                class="mr-2 h-7 w-7"
                alt="PrognoSports.com"
              >
              PrognoSports
            </router-link>

            <button
              type="button"
              class="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
              aria-label="menu"
              :aria-expanded="isOpen"
              @click="isOpen = !isOpen"
            >
              <i
                v-if="!isOpen"
                class="fas fa-bars"
              />
              <i
                v-else
                class="fas fa-xmark"
              />
            </button>
          </div>

          <div
            id="prognoNavbar"
            :class="[
              'border-t border-gray-200 pb-3 pt-3 md:flex md:flex-1 md:items-center md:justify-between md:border-t-0 md:pb-0 md:pt-0',
              isOpen ? 'block' : 'hidden md:flex'
            ]"
          >
            <div
              v-if="isLoggedIn"
              class="flex flex-col gap-1 md:mr-auto md:h-10 md:flex-row md:items-center md:gap-1"
            >
              <router-link
                class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
                to="/gps"
                @click="closeMobileMenu"
              >
                Grandes Premios
              </router-link>
              <router-link
                class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
                to="/circuits"
                @click="closeMobileMenu"
              >
                Circuitos
              </router-link>
              <router-link
                class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
                to="/ranking"
                @click="closeMobileMenu"
              >
                Ranking
              </router-link>
              <router-link
                v-if="currentUser.isAdmin()"
                class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
                to="/admin"
                @click="closeMobileMenu"
              >
                Admin
              </router-link>
            </div>

            <div
              v-if="!isLoggedIn"
              class="flex flex-wrap items-center justify-start gap-2 md:ml-auto md:justify-end"
            >
              <div class="flex flex-wrap justify-start gap-2 md:justify-end">
                <PButton
                  type="solid"
                  color="primary"
                  to="/register"
                  @click="closeMobileMenu"
                >
                  Registrarse
                </PButton>
                <PButton
                  type="outline"
                  color="primary"
                  to="/login"
                  @click="closeMobileMenu"
                >
                  Iniciar sesión
                </PButton>
              </div>
            </div>

            <div
              v-if="isLoggedIn"
              class="flex flex-col gap-2 md:ml-auto md:h-10 md:flex-row md:items-center md:justify-end md:gap-3"
            >
              <CommunitiesDropdown v-if="thereIsCurrentCommunity" />
              <SwitchTheme v-if="darkModeActivable" />
              <AvatarComponent />
            </div>
          </div>
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
import PButton from "@/components/lib/forms/PButton.vue";

const authStore = useAuthStore();
const communityStore = useCommunityStore();

const isLoggedIn = authStore.isLoggedIn;
const currentUser = authStore.loggedUser;
const thereIsCurrentCommunity = communityStore.thereIsCurrentCommunity;

const isOpen = ref(false);
const counter = ref(0);
const darkModeActivable = ref(localStorage.getItem('dark-mode') === 'true');

const closeMobileMenu = () => {
  isOpen.value = false;
};

const clickEasterEgg = () => {
  counter.value++;
  if (counter.value >= 33) {
    darkModeActivable.value = true;
    localStorage.setItem('dark-mode', 'true')
  }
}
</script>
