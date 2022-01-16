<template>
    <div>
        <LandingNavbar />

        <router-view/>

        <LandingFooter/>
    </div>
</template>

<style lang="scss">
    @import "landing";
</style>
<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import LandingNavbar from "@/components/landing/LandingNavbar.vue";
    import LandingFooter from "@/components/landing/LandingFooter.vue";

    @Component({
        components: {LandingFooter, LandingNavbar}
    })
    export default class LandingView extends Vue {
        btn() {
            this.$router.push("/register");
        }
    }
</script>