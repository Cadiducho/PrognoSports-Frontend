<template>
  <div>
    <Navbar />

    <section class="p-4">
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
    </section>

    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
import Navbar from "@/components/navbar/Navbar.vue";
import LandingFooter from "@/components/landing/LandingFooter.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import {ref} from "vue";

const isBeta = ref(import.meta.env.MODE == 'beta');
const betaAceptada = ref(localStorage.getItem("beta-accepted") === "true");
const acceptBeta = () => {
  localStorage.setItem("beta-accepted", "true");
}
</script>
