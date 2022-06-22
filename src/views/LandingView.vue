<template>
    <div>
        <LandingNavbar />

        <router-view/>

        <LandingFooter/>
    </div>
</template>

<script lang="ts">
import LandingNavbar from "@/components/landing/LandingNavbar.vue";
import LandingFooter from "@/components/landing/LandingFooter.vue";
import {defineComponent} from "vue";

export default defineComponent({
    name: "LandingView",
    components: {LandingFooter, LandingNavbar}
});
</script>