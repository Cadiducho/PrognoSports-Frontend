<template>
  <div>
    <Navbar />

    <router-view />

    <LandingFooter />
  </div>
</template>

<script lang="ts">
import Navbar from "@/components/navbar/Navbar.vue";
import LandingFooter from "@/components/landing/LandingFooter.vue";
import {defineComponent} from "vue";

export default defineComponent({
    name: "LandingLayout",
    components: {LandingFooter, Navbar}
});
</script>