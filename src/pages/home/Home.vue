<template>
  <PPage
    variant="plain"
    :heading="`Hola, ${currentUser.username}`"
    :subtitle="subtitle"
    :breadcrumb="false"
  >
    <HomeCountdownCard
      v-if="nextGp"
      :grand-prix="nextGp"
      :closure="nextClosure"
      :now="now"
    />

    <div class="grid grid-cols-1 items-start gap-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <HomeNextGrandPrix
        v-if="nextGp"
        :grand-prix="nextGp"
        :sessions="sessions"
        :done-count="doneCount"
      />
      <PCard v-else>
        <Loading v-if="nextLoading" />
        <p
          v-else
          class="text-center text-sm text-gray-600 dark:text-gray-400"
        >
          {{ nextFailed ? "No se ha podido cargar el próximo Gran Premio. Inténtalo de nuevo más tarde" : "No hay más Grandes Premios esta temporada" }}
        </p>
      </PCard>

      <div class="flex flex-col gap-5">
        <Loading v-if="loading" />
        <template v-else-if="played.length > 0">
          <HomeKpis
            :kpis="kpis"
            :resume="resume"
          />
          <HomeStandingsNeighbours
            v-if="neighbours.length > 0"
            :rows="neighbours"
          />
        </template>
        <PCard v-else>
          <p class="text-center text-sm text-gray-600 dark:text-gray-400">
            Aún no hay puntos que mostrar en esta temporada
          </p>
        </PCard>
      </div>
    </div>

    <Loading v-if="loading" />
    <HomeSeasonAnalysis
      v-else
      :username="currentUser.username"
      :grand-prixes="grandPrixes"
      :points-by-gp="pointsByGp"
    />
  </PPage>
</template>

<script setup lang="ts">
import { computed } from "vue";
import PPage from "@/components/lib/PPage.vue";
import PCard from "@/components/lib/PCard.vue";
import Loading from "@/components/lib/Loading.vue";
import HomeCountdownCard from "@/components/home/HomeCountdownCard.vue";
import HomeNextGrandPrix from "@/components/home/HomeNextGrandPrix.vue";
import HomeKpis from "@/components/home/HomeKpis.vue";
import HomeStandingsNeighbours from "@/components/home/HomeStandingsNeighbours.vue";
import HomeSeasonAnalysis from "@/components/home/HomeSeasonAnalysis.vue";
import { homeKpis, playedGps, standingsNeighbours } from "@/composables/charts/homeSeason";
import { useHomeSeason } from "@/composables/useHomeSeason";
import { useNextGrandPrix } from "@/composables/useNextGrandPrix";
import { useUserResume } from "@/composables/useUserResume";
import { useAuthStore } from "@/store/authStore";

defineOptions({ name: "Home" });

const currentUser = useAuthStore().loggedUser;

// Ambas cargas reaccionan al cambio de comunidad del navbar
const { loading, season, grandPrixes, pointsByGp, currentCommunity } = useHomeSeason();
const { resume } = useUserResume(season);
const { loading: nextLoading, failed: nextFailed, grandPrix: nextGp, sessions, nextClosure, doneCount, now } = useNextGrandPrix();

const played = computed(() => playedGps(grandPrixes.value, pointsByGp.value));
const kpis = computed(() => homeKpis(played.value, pointsByGp.value, currentUser.username));
const neighbours = computed(() => standingsNeighbours(played.value, pointsByGp.value, currentUser.username));

const subtitle = computed(() => {
  const competition = currentCommunity.value.competition;
  const name = [competition?.fullname || competition?.name, season.value?.name].filter(Boolean).join(" ");
  const gp = nextGp.value;
  if (!gp) {
    return name || undefined;
  }
  const round = season.value?.totalEvents ? `Ronda ${gp.round} de ${season.value.totalEvents}` : `Ronda ${gp.round}`;
  return name ? `${name} · ${round}` : round;
});
</script>
