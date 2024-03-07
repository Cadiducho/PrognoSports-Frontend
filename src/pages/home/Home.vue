<template>
    <div id="homeComponent">

        <PTitle name="Dashboard" />

        <div class="columns is-variable is-5">
            <div class="column is-4">
                <NextGrandPrix />
            </div>
            <div class="column is-8">
                <div class="tile">
                    <article class="tile is-child box">
                        <p class="title">Resumen</p>
                        <UserLevelResume :user="currentUser" />
                        <PointsAccumulated :user="currentUser" />
                    </article>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import NextGrandPrix from "@/components/gps/NextGrandPrix.vue";
import PointsAccumulated from "@/components/home/PointsAccumulated.vue";
import UserLevelResume from "@/components/user/UserLevelResume.vue";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";

export default defineComponent({
    name: "Home",
    components: {
        PTitle,
        UserLevelResume,
        PointsAccumulated,
        NextGrandPrix,
    },
    setup() {
        const authStore = useAuthStore();
        const communityStore = useCommunityStore();

        const currentUser = authStore.loggedUser;
        const isLoggedIn = authStore.isLoggedIn;
        const currentCommunity = communityStore.currentCommunity;
        return {isLoggedIn, currentUser, currentCommunity};
    },
});

</script>