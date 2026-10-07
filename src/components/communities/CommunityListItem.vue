<template>
  <PCard class="mb-4">
    <PMedia>
      <template #left>
        <router-link
          :to="'/communities/' + community.name"
          class="block h-12 w-12 overflow-hidden rounded-md"
        >
          <img
            class="h-full w-full object-cover"
            :src="community.communityImage()"
            alt="Logo"
          >
        </router-link>
      </template>
      <PTitle
        tag="p"
        type="header"
        no-margin
      >
        <router-link :to="'/communities/' + community.name">
          {{ community.name }}
        </router-link>
        <i class="font-normal"> - {{ community.competition.name }}</i>
      </PTitle>
      <p class="text-gray-600 dark:text-gray-300">
        {{ community.description }} (Creada por
        <router-link
          class="text-brand-600 hover:underline dark:text-brand-300"
          :to="'/u/' + community.owner.id"
        >
          @{{ community.owner.username }}
        </router-link>
        )
      </p>
    </PMedia>

    <div class="mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300">
      <p :class="community.open ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'">
        Comunidad {{ community.open ? "abierta" : "cerrada" }} con {{ community.members_amount }} participantes
      </p>
      <p class="italic">
        Comunidad creada el
        <time :datetime="community.created">{{ humanDateTime(community.created) }}</time>
      </p>
    </div>

    <div class="mt-3 flex flex-wrap gap-2">
      <p-button
        v-if="community.open && !isUserInCommunity"
        @click="isJoinModalActive = true"
      >
        Unirse
      </p-button>
      <p-button
        v-if="isUserInCommunity"
        color="danger"
        @click="isLeaveModalActive = true"
      >
        Dejar comunidad
      </p-button>
      <p-button
        tag="router-link"
        type="soft"
        color="info"
        :to="'/communities/' + community.name"
      >
        Detalles
      </p-button>
    </div>

    <PrognoModal
      v-model="isJoinModalActive"
      @handle="joinCommunity()"
    >
      <template #title>
        ¿Unirse a la comunidad?
      </template>
      <template #content>
        ¿Deseas unirte a la comunidad <span class="font-semibold">{{ community.name }}</span>?
      </template>
      <template #saveText>
        Unirse a la comunidad
      </template>
    </PrognoModal>

    <PrognoModal
      v-model="isLeaveModalActive"
      @handle="leaveCommunity()"
    >
      <template #title>
        ¿Salir de la comunidad?
      </template>
      <template #content>
        Estás seguro de que deseas abandonar la comunidad <span class="font-semibold">{{ community.name }}</span>?
      </template>
      <template #saveText>
        Dejar comunidad
      </template>
    </PrognoModal>
  </PCard>
</template>

<script lang="ts">
import {Community} from "@/types/Community";

import {defineComponent, PropType} from "vue";
import {useDayjs} from "@/composables/useDayjs";
import PrognoModal from "@/components/lib/PrognoModal.vue";
import {communityService, notificationService} from "@/_services";
import {useCommunityStore} from "@/store/communityStore";
import useEmitter from "@/composables/useEmitter";
import PCard from "@/components/lib/PCard.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PTitle from "@/components/lib/PTitle.vue";
import PMedia from "@/components/lib/PMedia.vue";

export default defineComponent({
    name: "CommunityListItem",
    components: {PTitle, PMedia, PCard, PButton, PrognoModal},
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
