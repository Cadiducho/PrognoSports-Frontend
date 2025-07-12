
<template>
  <PCard>
    <PTitle
      class="mb-5"
      name="Lista de Comunidades"
    />
    <div v-if="isLoading">
      <loading />
    </div>
    <div v-else>
      <PrognoAlert
        v-if="!thereIsCurrentCommunity"
        variant="danger"
      >
        No perteneces aún a ninguna comunidad. Para poder competir, debes unirte a alguna comunidad.
      </PrognoAlert>

      <p-button
        class="mb-4"
        color="primary"
        icon="fa fa-plus"
        :to="{name: 'communitiesCreate'}"
        tag="router-link"
        disabled
      >
        Nueva comunidad
      </p-button>

      <o-tabs
        v-model="activeTab"
        variant="boxed"
      >
        <o-tab-item
          label="Mis comunidades"
          :value="0"
        >
          <p-input
            v-model="filtroComunidad"
            placeholder="Buscar comunidad"
            type="search"
            icon-pack="fas"
            icon="search"
          />
          <CommunityListItem
            v-for="(community, index) in filteredCommunities(myCommunityList)"
            :key="index"
            :community="community"
            :is-user-in-community="myCommunityList.some(c => c.id === community.id)"
          />
        </o-tab-item>

        <o-tab-item
          label="Abiertas"
          :value="1"
        >
          <p-input
            v-model="filtroComunidad"
            placeholder="Buscar comunidad"
            type="search"
            icon-pack="fas"
            icon="search"
          />
          <CommunityListItem
            v-for="(community, index) in openCommunities"
            :key="index"
            :community="community"
            :is-user-in-community="myCommunityList.some(c => c.id === community.id)"
          />
        </o-tab-item>

        <o-tab-item
          label="Cerradas"
          :value="2"
        >
          <p-input
            v-model="filtroComunidad"
            placeholder="Buscar comunidad"
            type="search"
            icon-pack="fas"
            icon="search"
          />
          <PrognoAlert variant="info">
            Para formar parte de comunidades cerradas necesitarás una invitación
          </PrognoAlert>
          <CommunityListItem
            v-for="(community, index) in closedCommunities"
            :key="index"
            :community="community"
            :is-user-in-community="myCommunityList.some(c => c.id === community.id)"
          />
        </o-tab-item>

        <o-tab-item
          label="Todas"
          :value="3"
        >
          <p-input
            v-model="filtroComunidad"
            placeholder="Buscar comunidad"
            type="search"
            icon-pack="fas"
            icon="search"
          />
          <CommunityListItem
            v-for="(community, index) in filteredCommunities(communityList)"
            :key="index"
            :community="community"
            :is-user-in-community="myCommunityList.some(c => c.id === community.id)"
          />
        </o-tab-item>
      </o-tabs>
    </div>
  </PCard>
</template>

<script setup lang="ts">
import useEmitter from "@/composables/useEmitter";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import {Community} from "@/types/Community";
import {computed, onMounted, ref} from "vue";
import {communityService} from "@/_services";
import PTitle from "@/components/lib/PTitle.vue";
import PCard from "@/components/lib/PCard.vue";
import CommunityListItem from "@/components/communities/CommunityListItem.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import PButton from "@/components/lib/forms/PButton.vue";

const emitter = useEmitter();
const authStore = useAuthStore();
const communityStore = useCommunityStore();

const currentUser = authStore.loggedUser;
const thereIsCurrentCommunity = communityStore.thereIsCurrentCommunity;

const activeTab = ref(1);
const filtroComunidad = ref('');
const isLoading = ref(true);
const communityList = ref<Array<Community>>([]);
const myCommunityList = ref<Array<Community>>([]);

const openCommunities = computed(() => {
  return filteredCommunities(communityList.value).filter(({open}) => (open));
});

const closedCommunities = computed(() => {
  return filteredCommunities(communityList.value).filter(({open}) => (!open));
});

onMounted(() => {
  loadCommunities();

  emitter.on('reloadCommunitiesList', () => {
    isLoading.value = true;
    loadCommunities();
  });
});

const loadCommunities = async () => {
  try {
    const [communities, userCommunities] = await Promise.all([
      communityService.getAllCommunities(),
      communityService.getUserCommunities(currentUser)
    ]);
    communityList.value = communities;
    myCommunityList.value = userCommunities;
  } catch (error) {
    console.error("Error loading communities:", error);
  } finally {
    isLoading.value = false;
  }
};

const filteredCommunities = (originalList: Array<Community>): Array<Community> => {
  if (!filtroComunidad.value.trim()) {
    return originalList;
  }

  const filtroLowerCase: string = filtroComunidad.value.toLowerCase().trim();

  return originalList.filter((community) => {
    return (
      community.name
        .toLowerCase()
        .includes(filtroLowerCase) ||
      community.owner.username
        .toLowerCase()
        .includes(filtroLowerCase)
    );
  });
}
</script>
