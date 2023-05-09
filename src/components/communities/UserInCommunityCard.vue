<template>
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