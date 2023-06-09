<template>
    <router-link
        :to="{name: 'user', params: { user: member.user.id }}"
        class="bg-white shadow-lg rounded-lg overflow-hidden my-4 w-full hover:shadow-xl hover:scale-110 transition ease-in-out delay-150 duration-300"
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
                <span class="icon-text text-sm" v-if="member.user.last_activity">
                    <span class="icon">
                        <i class="fas fa-clock"></i>
                    </span>
                    <span>
                        Última conexión {{ dateDiff(member.user.last_activity) }}
                    </span>
                </span>
            </div>
            <!-- User created at -->
            <div class="flex text-gray-700">
                <span class="icon-text text-sm" v-if="member.user.last_activity">
                    <span class="icon-text">
                        <span class="icon">
                            <i class="fas fa-calendar"></i>
                        </span>
                        <span>Se unió el {{ humanDateTime(member.user.created) }}</span>
                    </span>
                </span>
            </div>

            <!-- Permissions -->
            <!--
            <span class="icon-text" v-if="member.can_kick_users">
                <span class="icon">
                    <i class="fas fa-ban"></i>
                </span>
                <span>Puede expulsar usuarios</span>
            </span>

            <span class="icon-text ml-1" v-if="member.can_modify_permissions">
                <span class="icon">
                    <i class="fas fa-user-edit"></i>
                </span>
                <span>Puede modificar permisos</span>
            </span>

            <span class="icon-text" v-if="member.can_recreate_invitation">
                <span class="icon">
                    <i class="fas fa-envelope"></i>
                </span>
                <span>Puede recrear invitaciones</span>
            </span>
            -->
        </div>
    </router-link>
    <!--
    <div class="column is-half">
        <div class="box">
            <article class="media">
                <div class="media-left">
                    <figure class="image is-64x64">
                        <img :src="member.user.profileImage()" alt="User image">
                    </figure>
                </div>
                <div class="media-content">
                    <div class="content">
                        <p class="is-flex is-justify-content-space-between">
                            <span>
                                <strong>
                                    <router-link :to="{name: 'user', params: { user: member.user.id }}">
                                        {{ member.user.username }}
                                    </router-link>
                                </strong>
                                <small class="ml-2" :style="{ color : '#' + member.user.rank.color }">
                                    {{ member.user.rank.name }}
                                </small>
                            </span>
                            <small>
                                <span class="icon-text" v-if="member.user.last_activity">
                                    <span class="icon">
                                        <i class="fas fa-clock"></i>
                                    </span>
                                    <span>
                                        <o-tooltip label="Última conexión">
                                            {{ dateDiff(member.user.last_activity) }}
                                        </o-tooltip>
                                    </span>
                                </span>
                            </small>
                        </p>
                        <p>{{ member.user.bio }}</p>
                        <p>
                            <span class="icon-text">
                                <span class="icon">
                                    <i class="fas fa-calendar"></i>
                                </span>
                                <span>Se unió el {{ humanDateTime(member.user.created) }}</span>
                            </span>
                        </p>
                    </div>

                    <span class="icon-text" v-if="member.can_kick_users">
                        <span class="icon">
                            <i class="fas fa-ban"></i>
                        </span>
                        <span>Puede expulsar usuarios</span>
                    </span>

                    <span class="icon-text ml-1" v-if="member.can_modify_permissions">
                        <span class="icon">
                            <i class="fas fa-user-edit"></i>
                        </span>
                        <span>Puede modificar permisos</span>
                    </span>

                    <span class="icon-text" v-if="member.can_recreate_invitation">
                        <span class="icon">
                            <i class="fas fa-envelope"></i>
                        </span>
                        <span>Puede recrear invitaciones</span>
                    </span>
                </div>
            </article>
        </div>
    </div>
    -->
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {useDayjs} from "@/composables/useDayjs";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import {useClipboard} from "@/composables/clipboard";
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
        const clipboard = useClipboard();

        const dateDiff = dayjs.dateDiff;
        const humanDateTime = dayjs.humanDateTime;
        const currentUser = authStore.loggedUser;
        const currentCommunity = communityStore.currentCommunity;
        return { currentUser, currentCommunity, dateDiff, humanDateTime, clipboard };
    },
})
</script>

<style scoped lang="scss">

</style>