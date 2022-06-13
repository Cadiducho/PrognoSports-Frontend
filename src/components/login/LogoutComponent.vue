<template>
    <div id="logoutComponent"></div>
</template>

<script lang="ts">

import {useAuthStore} from "@/pinia/authStore";
import {defineComponent} from "vue";

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
            this.$oruga.notification.open({
                position: 'top',
                message: 'Has cerrado sesión correctamente',
                type: 'info'
            });
        });
    }
});
</script>