<template>
    <div id="logoutComponent">

    </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import { AuthModule } from "@/_store/modules/AuthModule";

@Component
export default class Logout extends Vue {

    created () {
        AuthModule.logout().then(() => {
            this.$router.push({name: 'home'});
        });
    }
};
</script>