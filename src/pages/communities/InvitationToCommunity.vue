<template>
  <PCard>
    <PTitle
      class="mb-5"
      :name="communityName"
    />

    <loading v-if="isLoading" />

    <p v-if="!thereIsCommunity">
      La comunidad con nombre <i>{{ communityId }}</i> no ha sido encontrada
    </p>
    <template v-else>
      Validando invitación a la comunidad {{ community.name }}...
      <loading />
    </template>
  </PCard>
</template>

<script setup lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import { communityService, notificationService } from "@/_services";
import { Community } from "@/types/Community";
import { useCommunityStore } from "@/store/communityStore";
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import PCard from "@/components/lib/PCard.vue";

const communityStore = useCommunityStore();
const setCommunity = communityStore.setCommunity;

const community = ref<Community>({} as Community);
const isLoading = ref(true);
const thereIsCommunity = ref(false);

const route = useRoute();
const router = useRouter();

const communityId = route.params.community as string;
const code = route.params.code as string;

const communityName = computed(() => {
  return thereIsCommunity.value ? community.value.name : "Comunidad no encontrada";
});

onMounted(() => {
  communityService.getCommunityById(communityId).then((communityRes) => {
    community.value = communityRes;
    thereIsCommunity.value = true;

    communityService.joinCommunity(communityRes, code).then((communityRes) => {
      setTimeout(() => {
        notificationService.showNotification("¡Te has unido correctamente a " + communityRes.name + "!");
        setCommunity(communityRes);
        router.push({
          name: 'communitiesDetails',
          params: {
            community: communityRes.name,
          }
        });
      }, 500);
    }).catch((reason) => {
      setTimeout(() => {
        notificationService.showNotification("Ha ocurrido un error: " + reason.message, "error");
        router.push({
          name: 'communitiesList',
        });
      }, 500);
    });
  }).catch(() => {
    thereIsCommunity.value = false;
  }).finally(() => {
    isLoading.value = false;
  });
});
</script>
