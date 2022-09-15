<template>
    <div>
        <Navbar />

        <section class="section is-tiny">
            <div class="container prognocontainer">

                <Breadcrumb />

                <o-notification v-if="isBeta && !betaAceptada" closable variant="warning" aria-close-label="Close notification" @close="acceptBeta()">
                    Estás utilizando PrognoSports Beta, la experiencia puede verse afectada
                </o-notification>

                <router-view :key="$route.fullPath"/>
            </div>
        </section>

        <LandingFooter/>
    </div>
</template>

<script lang="ts">
import Navbar from "@/components/navbar/Navbar.vue";
import Breadcrumb from "@/components/lib/Breadcrumb.vue";
import LandingFooter from "@/components/landing/LandingFooter.vue";

import {defineComponent} from "vue";

export default defineComponent({
    name: "PrognoView",
    components: {
        Navbar,
        Breadcrumb,
        LandingFooter,
    },
    setup() {
        const isBeta = import.meta.env.MODE == 'beta';
        const betaAceptada: boolean = localStorage.getItem("beta-accepted") === "true";
        const acceptBeta = () => {
            localStorage.setItem("beta-accepted", "true");
        };

        return { isBeta, betaAceptada, acceptBeta }
    }
});
</script>