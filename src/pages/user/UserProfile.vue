<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import type { User } from "@/types/User";
import { userService } from "@/_services";
import { useAuthStore } from "@/store/authStore";
import { useHomeSeason } from "@/composables/useHomeSeason";
import { playedGps, userSeries } from "@/composables/charts/homeSeason";
import { computeProfileHighlights } from "@/composables/charts/profileStats";
import PPage from "@/components/lib/PPage.vue";
import PCard from "@/components/lib/PCard.vue";
import PTitle from "@/components/lib/PTitle.vue";
import UserProfileCard from "@/components/user/UserProfileCard.vue";
import UserLevelResume from "@/components/user/UserLevelResume.vue";
import ProfileHighlights from "@/components/user/ProfileHighlights.vue";
import ProfileCommunities from "@/components/user/ProfileCommunities.vue";
import HomeSeasonCharts from "@/components/home/HomeSeasonCharts.vue";

const route = useRoute();
const authStore = useAuthStore();
const currentUser = authStore.loggedUser;

const isLoading = ref(true);
const profile = ref<User>({ id: 0 } as User);

// Se comparte con las gráficas para no repetir la petición de puntos de la temporada
const season = useHomeSeason();

const requestedUser = computed(() => route.params.user as string | undefined);
const isOwnProfile = computed(() => profile.value.id !== 0 && profile.value.id === currentUser.id);

const pageTitle = computed(() => {
  if (isLoading.value || profile.value.id === 0) return undefined;
  return isOwnProfile.value ? "Tu perfil" : profile.value.username;
});

// Evita que una respuesta lenta de un perfil anterior pise al actual
let lastRequest = 0;

watch(requestedUser, async (param) => {
  const request = ++lastRequest;
  isLoading.value = true;

  // Sin usuario en la URL se muestra el que ha iniciado sesión
  if (!param) {
    profile.value = currentUser;
    isLoading.value = false;
    return;
  }

  try {
    const user = await userService.getUser(param);
    if (request === lastRequest) {
      profile.value = user;
    }
  } catch (error: unknown) {
    console.error(error);
    if (request === lastRequest) {
      profile.value = { id: 0 } as User;
    }
  } finally {
    if (request === lastRequest) {
      isLoading.value = false;
    }
  }
}, { immediate: true });

const userSeasonSeries = computed(() => {
  const played = playedGps(season.grandPrixes.value, season.pointsByGp.value);
  return userSeries(played, season.pointsByGp.value, profile.value.username);
});
const highlights = computed(() => computeProfileHighlights(userSeasonSeries.value));

// En el perfil de otro usuario se compara con quien lo mira desde el principio
const initialCompare = computed(() => (isOwnProfile.value ? undefined : currentUser.username));
</script>

<template>
  <PPage
    variant="plain"
    :title="pageTitle"
    :loading="isLoading"
    :not-found="profile.id === 0 && 'Perfil no encontrado'"
  >
    <PCard>
      <UserProfileCard
        :profile="profile"
        :show-settings-button="true"
      />

      <hr class="border-gray-200 dark:border-gray-700">

      <UserLevelResume
        :key="profile.id"
        :user="profile"
      />
    </PCard>

    <PCard v-if="season.currentCommunity.value.id !== 0">
      <PTitle
        tag="h3"
        type="subtitle"
      >
        Temporada en {{ season.currentCommunity.value.name }}
      </PTitle>

      <ProfileHighlights
        v-if="highlights"
        :highlights="highlights"
        class="mb-4"
      />
      <p
        v-else-if="!season.loading.value"
        class="mb-2 text-sm text-gray-600 dark:text-gray-400"
      >
        {{ isOwnProfile ? "Aún no tienes" : `${profile.username} no tiene` }} puntos en esta comunidad esta temporada.
      </p>

      <HomeSeasonCharts
        v-if="highlights || season.loading.value"
        :key="profile.id"
        :user="profile"
        :season="season"
        :own="isOwnProfile"
        :initial-compare="initialCompare"
        :show-ranking-button="false"
      />
    </PCard>

    <PCard v-if="profile.id !== 0">
      <ProfileCommunities :user="profile" />
    </PCard>
  </PPage>
</template>
