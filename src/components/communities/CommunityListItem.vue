<template>
    <div class="card mb-4">
        <div class="card-content">
            <div class="media">
                <div class="media-left">
                    <figure class="image is-48x48">
                        <router-link :to="'/communities/' + community.name">
                            <img :src="community.communityImage()" alt="Logo">
                        </router-link>
                    </figure>
                </div>
                <div class="media-content">
                    <p class="title is-4">
                        <router-link :to="'/communities/' + community.name" class="has-text-black">{{ community.name }}</router-link>
                        <i> - {{ community.competition.name }}</i>
                    </p>
                    <p class="subtitle is-6">{{ community.description }} (Creada por <router-link :to="'/u/' + community.owner.id">@{{community.owner.username}}</router-link>)</p>
                </div>
            </div>

            <div class="content">
                <span v-bind:class="[community.open ? 'has-text-success' : 'has-text-danger']">
                    Comunidad {{ community.open ? "abierta" : "cerrada" }} con {{ community.members_amount }} participantes
                </span><br />
                <br>
                <i>Comunidad creada el <time :datetime="community.created">{{ humanDateTime(community.created) }}</time></i>
                <br />
                <div class="buttons mt-2">
                    <o-button v-if="community.open && !isUserInCommunity" variant="success" @click="this.isJoinModalActive = true">Unirse</o-button>
                    <o-button v-if="isUserInCommunity" variant="danger" @click="this.isLeaveModalActive = true">Dejar comunidad</o-button>
                    <o-button tag="router-link" variant="link is-light" :to="'/communities/' + community.name">Detalles</o-button>
                </div>
            </div>
        </div>

        <PrognoModal v-show="isJoinModalActive" @close="isJoinModalActive = false" @handle="joinCommunity()">
            <template v-slot:title>¿Unirse a la comunidad?</template>
            <template v-slot:content>
                ¿Deseas unirte a la comunidad <span class="has-text-weight-semibold">{{ community.name }}</span>?
            </template>
            <template v-slot:saveText>Unirse a la comunidad</template>
        </PrognoModal>

        <PrognoModal v-show="isLeaveModalActive" @close="isLeaveModalActive = false" @handle="leaveCommunity()">
            <template v-slot:title>¿Salir de la comunidad?</template>
            <template v-slot:content>
                Estás seguro de que deseas abandonar la comunidad <span class="has-text-weight-semibold">{{ community.name }}</span>?
            </template>
            <template v-slot:saveText>Dejar comunidad</template>
        </PrognoModal>
    </div>
</template>

<script lang="ts">
import {Community} from "@/types/Community";
import ConfirmLeaveCommunityModal from "@/components/communities/ConfirmLeaveCommunityModal.vue";
import ConfirmJoinCommunityModal from "@/components/communities/ConfirmJoinCommunityModal.vue";

import {defineComponent, PropType} from "vue";
import {useDayjs} from "@/composables/useDayjs";
import PrognoModal from "@/components/lib/PrognoModal.vue";
import {communityService, notificationService} from "@/_services";
import {useCommunityStore} from "@/store/communityStore";
import useEmitter from "@/composables/useEmitter";

export default defineComponent({
    name: "CommunityListItem",
    components: {PrognoModal, ConfirmJoinCommunityModal, ConfirmLeaveCommunityModal},
    props: {
        community: {
            type: Object as PropType<Community>,
            required: true,
        },
        isUserInCommunity: {
            type: Boolean,
            required: true,
        }
    },
    setup() {
        const dayjs = useDayjs();
        const emitter = useEmitter();
        const communityStore = useCommunityStore();

        const humanDateTime = dayjs.humanDateTime;

        const currentCommunity = communityStore.currentCommunity;
        const setCommunity = communityStore.setCommunity;
        const removeCommunity = communityStore.removeCommunity;
        return { humanDateTime, emitter, currentCommunity, setCommunity, removeCommunity }
    },
    data() {
        return {
            isJoinModalActive: false,
            isLeaveModalActive: false,
        }
    },
    methods: {
        joinCommunity() {
            communityService.joinCommunity(this.community).then(communityRes => {
                notificationService.showNotification("¡Te has unido correctamente a " + communityRes.name + "!");

                this.setCommunity(communityRes);
                this.$router.push(`/communities/${communityRes.name}`);
            }).catch((error) => {
                notificationService.showNotification("Ha ocurrido un error: " + error.message, "error");
            }).finally(() => {
                this.emitter.emit('reloadCommunitiesList');
                this.emitter.emit('reloadCommunitiesDropdown');
                this.isJoinModalActive = false;
            });
        },
        leaveCommunity() {
            if (this.community.id == this.currentCommunity.id) {
                notificationService.showNotification("No puedes dejar la comunidad en la que estás en este momento", "error");
                this.$emit('close');
            } else {
                communityService.quitCommunity(this.community).then(() => {
                    notificationService.showNotification("¡Has dejado la comunidad " + this.community.name + "!");
                }).catch((error) => {
                    notificationService.showNotification("Ha ocurrido un error: " + error.message, "error");
                }).finally(() => {
                    this.emitter.emit('reloadCommunitiesList');
                    this.emitter.emit('reloadCommunitiesDropdown');
                    this.isLeaveModalActive = false;
                });
            }
        }
    }
});
</script>