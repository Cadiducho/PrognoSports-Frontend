<template>
    <div>
        <Navbar />

        <section class="section is-tiny">
            <div class="container prognocontainer">

                <Breadcrumb />

                <o-notification v-if="!betaAceptada" closable variant="warning" aria-close-label="Close notification" @close="acceptBeta()">
                    Estás utilizando PrognoSports Beta, la experiencia puede verse afectada
                </o-notification>

                <router-view :key="$route.fullPath"/>
            </div>
        </section>

        <LandingFooter/>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import Navbar from "@/components/navbar/Navbar.vue";
import Breadcrumb from "@/components/lib/Breadcrumb.vue";
import LandingFooter from "@/components/landing/LandingFooter.vue";

@Component({
    components: {
        Navbar,
        Breadcrumb,
        LandingFooter
    }
})
export default class PrognoView extends Vue {

    betaAceptada: boolean = localStorage.getItem("beta-accepted") === "true";

    acceptBeta() {
        localStorage.setItem("beta-accepted", "true");
    }
}
</script>