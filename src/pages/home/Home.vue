<template>
    <div id="homeComponent">

        <PTitle name="Dashboard" />

        <div class="flex flex-wrap -mx-4">
            <div class="w-full md:w-1/3 p-4">
                <NextGrandPrix />
            </div>
            <div class="w-full md:w-2/3 p-4">
                <PCard>
                    <PTitle tag="h3">Resumen</PTitle>
                    <UserLevelResume :user="currentUser" />
                    <PointsAccumulated :user="currentUser" />
                </PCard>
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
import PCard from "@/components/lib/PCard.vue";

export default defineComponent({
    name: "Home",
    components: {
        PCard,
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