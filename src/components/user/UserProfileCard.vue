<template>

    <div class="section">
        <div class="container">
            <div class="columns is-mobile">
                <div class="column is-1"></div>
                <div class="column">
                    <figure class="image is-1by1">
                        <img :src="userProfileImage(profile)" alt="Profile image"/>
                    </figure>
                </div>
                <div class="column is-1"></div>
                <div class="column is-two-thirds content">
                    <p class="is-flex is-mobile is-justify-content-space-between">
                        <span class="title is-bold">
                            {{ profile.username }}

                            <span class="tag" :style="styleRankTag(profile.rank)">{{ profile.rank.name }}</span>
                        </span>

                        <o-button v-if="showSettingsButton && profile.id === currentUser.id"
                                  variant="primary" icon-left="cog" tag="router-link" to="/settings">
                            Ajustes
                        </o-button>
                    </p>
                    <p v-if="profile.bio">
                        <span class="subtitle">
                            <small>{{ profile.bio }}</small>
                        </span>
                    </p>

                    <div class="block mb-1">
                        <span class="icon-text">
                            <span class="icon mr-2">
                                <i class="fas fa-clock"></i>
                            </span>
                            Última conexión: {{ dateDiff(profile.last_activity) }}
                        </span>
                    </div>
                    <div class="block mb-1">
                        <span class="icon-text">
                            <span class="icon mr-2">
                                <i class="fas fa-calendar"></i>
                            </span>
                            Registrado el {{ humanDateTime(profile.created) }}
                        </span>
                    </div>
                    <div v-if="profile.location" class="block mb-1">
                        <span class="icon-text">
                            <span class="icon mr-2">
                                <i class="fas fa-map-marker-alt"></i>
                            </span>
                            {{ profile.location }}
                        </span>
                    </div>
                    <div v-if="profile.birthdate" class="block mb-1">
                        <span class="icon-text">
                            <span class="icon mr-2">
                                <i class="fas fa-birthday-cake"></i>
                            </span>
                            {{ humanDate(profile.birthdate) }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {useDayjs} from "@/composables/useDayjs";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import {User} from "@/types/User";

export default defineComponent({
    name: "UserProfileCard",
    props: {
        profile: {
            type: Object as PropType<User>,
            required: true
        },
        showSettingsButton: {
            type: Boolean,
            required: true,
        }
    },
    setup() {
        const dayjs = useDayjs();
        const authStore = useAuthStore();
        const communityStore = useCommunityStore();

        const dateDiff = dayjs.dateDiff;
        const humanDateTime = dayjs.humanDateTime;
        const humanDate = dayjs.humanDate;
        const currentUser = authStore.user;
        const currentCommunity = communityStore.community;
        return {currentUser, currentCommunity, dateDiff, humanDateTime, humanDate};
    }
});
</script>

<style scoped>

</style>