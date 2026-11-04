<template>
  <!-- En móvil se deja sitio abajo para la barra de pestañas fija cuando se muestra -->
  <div :class="['min-h-screen flex flex-col', showTabBar ? 'pb-16 md:pb-0' : '']">
    <Navbar />

    <main class="flex-1 p-4">
      <section class="w-full lg:px-6 lg:py-4">
        <PrognoAlert
          v-if="isBeta && !betaAceptada"
          variant="warning"
          @after-close="acceptBeta()"
        >
          Estás utilizando PrognoSports Beta, la experiencia puede verse afectada
        </PrognoAlert>

        <router-view :key="$route.fullPath" />
      </section>
    </main>

    <LandingFooter />

    <MobileTabBar v-if="showTabBar" />
  </div>
</template>

<script setup lang="ts">
import Navbar from "@/components/navbar/Navbar.vue";
import MobileTabBar from "@/components/navbar/MobileTabBar.vue";
import LandingFooter from "@/components/landing/LandingFooter.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import {computed, ref} from "vue";
import {storeToRefs} from "pinia";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";

const authStore = useAuthStore();
const {thereIsCurrentCommunity} = storeToRefs(useCommunityStore());

// Sus destinos exigen sesión, correo verificado y comunidad; sin ellos los guards solo redirigirían de vuelta
const showTabBar = computed(() => authStore.isLoggedIn && authStore.loggedUser.isVerified() && thereIsCurrentCommunity.value);

const isBeta = ref(import.meta.env.MODE == 'beta');
const betaAceptada = ref(localStorage.getItem("beta-accepted") === "true");
const acceptBeta = () => {
  localStorage.setItem("beta-accepted", "true");
}
</script>
