<template>
    <div id="logoutComponent"></div>
</template>

<script lang="ts">

import {useAuthStore} from "@/store/authStore";
import {defineComponent} from "vue";
import {notificationService} from "@/_services";

export default defineComponent({
    name: "LogoutComponent",
    setup() {
        const authStore = useAuthStore();

        const signOut = authStore.signOut;
        return { signOut };
    },
    created() {
        this.signOut().then(() => {
            this.$router.push({name: 'login'});
            notificationService.showNotification('Has cerrado sesión correctamente', 'info');
        });
    }
});
</script>