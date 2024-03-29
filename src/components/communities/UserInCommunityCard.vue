<template>
    <router-link
        :to="{name: 'user', params: { user: member.user.id }}"
        class="bg-white shadow-lg rounded-lg overflow-hidden my-4 w-full hover:shadow-xl hover:scale-105 transition ease-in-out delay-150 duration-300"
        >
        <img class="w-full h-48 object-cover object-center" :src="member.user.profileImage()" alt="User image">
        <div class="px-6 py-2 bg-gray-200">
            <h1 class="mx-3 text-white font-semibold text-lg text-center" :style="{ color : '#' + member.user.rank.color }">{{ member.user.rank.name }}</h1>
        </div>
        <div class="py-4 px-5">
            <!-- Username -->
            <h1 class="text-2xl font-semibold text-gray-800">{{ member.user.username }}</h1>
            <!-- Bio -->
            <p class="py-2 text-sm text-gray-700">{{ member.user.bio }}</p>

            <!-- Last activity -->
            <div class="flex mt-4 text-gray-700">
                <span class="flex flex-nowrap text-sm" v-if="member.user.last_activity">
                    <span class="mr-3">
                        <i class="fas fa-clock"></i>
                    </span>
                    Última conexión {{ dateDiff(member.user.last_activity) }}
                </span>
            </div>

            <!-- User created at -->
            <div class="flex text-gray-700">
                <span class="flex flex-nowrap text-sm" v-if="member.user.created">
                    <span class="mr-3">
                        <i class="fas fa-calendar"></i>
                    </span>
                    <span>Se unió el {{ humanDateTime(member.user.created) }}</span>
                </span>
            </div>

            <!-- Location -->
            <div class="flex text-gray-700">
                <span class="flex flex-nowrap text-sm" v-if="member.user.location">
                    <span class="mr-3">
                        <i class="fas fa-map-marker-alt"></i>
                    </span>
                    <span>{{ member.user.location }}</span>
                </span>
            </div>

            <!-- Birthdate -->
            <div class="flex text-gray-700">
                <span class="flex flex-nowrap text-sm" v-if="member.user.birthdate">
                    <span class="mr-3">
                        <i class="fas fa-birthday-cake"></i>
                    </span>
                    <span>{{ humanDate(member.user.birthdate) }}</span>
                </span>
            </div>

        </div>
    </router-link>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {useDayjs} from "@/composables/useDayjs";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import {CommunityUser} from "@/types/CommunityUser";

export default defineComponent({
    name: "UserInCommunityCard",
    props: {
        member: {
            type: Object as PropType<CommunityUser>,
            required: true
        },
    },
    setup() {
        const dayjs = useDayjs();
        const authStore = useAuthStore();
        const communityStore = useCommunityStore();

        const dateDiff = dayjs.dateDiff;
        const humanDate = dayjs.humanDate;
        const humanDateTime = dayjs.humanDateTime;
        const currentUser = authStore.loggedUser;
        const currentCommunity = communityStore.currentCommunity;
        return { currentUser, currentCommunity, dateDiff, humanDate, humanDateTime };
    },
})
</script>

<style scoped lang="scss">

</style>