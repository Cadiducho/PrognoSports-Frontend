<template>
    <div>
        <Navbar />

        <section class="section">
            <section class="container prognocontainer">

                <Breadcrumb />

                <o-notification v-if="isBeta && !betaAceptada" closable variant="warning" aria-close-label="Close notification" @close="acceptBeta()">
                    Estás utilizando PrognoSports Beta, la experiencia puede verse afectada
                </o-notification>

                <router-view :key="$route.fullPath"/>
            </section>
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
    name: "PrognoLayout",
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

<style scoped>
.section {
    padding: 1rem;
}
.container.prognocontainer {
    max-width: none !important;
    width: 100%;
}

@media screen and (min-width: 1024px) {
    .container.prognocontainer {
        padding-left: 32px;
        padding-right: 32px;
    }
}
</style>