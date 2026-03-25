<template>
  <PCard
    id="gplist"
  >
    <PTitle name="Grandes Premios" />

    <div class="grid grid-cols-1 gap-5 lg:grid-cols-12">
      <div class="order-2 lg:order-1 lg:col-span-8">
        <o-tabs
          v-if="seasonReady && competitionReady"
          v-model="activeTab"
        >
          <o-tab-item
            label="Todos"
            :value="0"
          >
            <GrandPrixesList :gps="allGps" />
          </o-tab-item>

          <o-tab-item
            label="Próximos"
            :value="1"
          >
            <GrandPrixesList :gps="nextEvents" />
          </o-tab-item>

          <o-tab-item
            label="Pasados"
            :value="2"
          >
            <GrandPrixesList :gps="pastEvents" />
          </o-tab-item>
        </o-tabs>
        <loading v-else />
      </div>
      <div class="order-1 lg:order-2 lg:col-span-4">
        <div
          v-if="allGps && allGps.length"
          class="timeline"
        >
          <header class="timeline-header">
            <PTag color="info">
              {{ firstEventYear }}
            </PTag>
          </header>
          <div
            v-for="(gp, index) in allGps"
            :key="gp.name + index"
            class="timeline-item"
            :class="{
              'is-primary': isAfter(gp.lastDate()),
              'is-danger': isThisWeek(gp.lastDate()),
              'is-warning': isBefore(gp.firstDate()),
            }"
          >
            <div
              v-if="isThisWeek(gp.lastDate())"
              class="timeline-marker is-danger is-icon"
            >
              <i class="fa fa-flag" />
            </div>
            <div
              v-else-if="isBefore(gp.lastDate()) || Number.isNaN(gp.lastDate().getTime())"
              class="timeline-marker is-warning"
            />
            <div
              v-else
              class="timeline-marker is-primary"
            />

            <router-link :to="gp.gpLink()">
              <div class="timeline-content text-gray-700 dark:text-white no-underline">
                <p>
                  <span v-if="Number.isNaN(gp.firstDate().getDate())">Sin fecha</span>
                  <span v-else>{{ gp.firstDate().getDate() }} - {{ humanDayMonth(gp.lastDate()) }}</span>
                  <PTag
                    v-if="isThisWeek(gp.lastDate())"
                    color="primary"
                    class="ml-2"
                  >
                    Próximo
                  </PTag>
                </p>
                <p>{{ gp.name }}</p>
              </div>
            </router-link>
          </div>
          <div class="timeline-header">
            <PTag color="info">
              {{ lastEventYear }}
            </PTag>
          </div>
        </div>
      </div>
    </div>
  </PCard>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";

import { grandPrixService, seasonService } from "@/_services";
import { useDayjs } from "@/composables/useDayjs";
import useEmitter from "@/composables/useEmitter";
import GrandPrixesList from "@/components/gps/list/GrandPrixesList.vue";
import PCard from "@/components/lib/PCard.vue";
import PTag from "@/components/lib/PTag.vue";
import PTitle from "@/components/lib/PTitle.vue";
import { useCommunityStore } from "@/store/communityStore";
import { Competition } from "@/types/Competition";
import { GrandPrix } from "@/types/GrandPrix";
import { Season } from "@/types/Season";

const communityStore = useCommunityStore();
const { currentCommunity } = storeToRefs(communityStore);
const route = useRoute();
const dayjs = useDayjs();
const emitter = useEmitter();

const humanDayMonth = dayjs.humanDayMonth;
const humanMonth = dayjs.humanMonth;
const isBefore = dayjs.isBefore;
const isAfter = dayjs.isAfter;
const isThisWeek = dayjs.isThisWeek;

const competition = ref<Competition>({ id: 0 } as Competition);
const season = ref<Season>({ id: 0 } as Season);

const shouldSearchDefaultCompetition = ref(false);
const shouldSearchDefaultSeason = ref(false);
const activeTab = ref(0);

const competitionReady = ref(false);
const seasonReady = ref(false);

const allGps = ref<Array<GrandPrix>>([]);
const firstEventYear = ref("");
const lastEventYear = ref("");

const nextEvents = computed(() => allGps.value.filter(gp => isBefore(gp.firstDate())));
const pastEvents = computed(() => allGps.value.filter(gp => isAfter(gp.lastDate())));

function searchDefaultCompetition(): void {
  if (shouldSearchDefaultCompetition.value) {
    competition.value = currentCommunity.value.competition;
  }
  competitionReady.value = true;
}

function searchDefaultSeason(): void {
  if (shouldSearchDefaultSeason.value) {
    seasonService.getCurrentSeason(currentCommunity.value.competition).then((currentSeason) => {
      season.value = currentSeason;
      seasonReady.value = true;
    });
  } else {
    seasonReady.value = true;
  }
}

watch(currentCommunity, () => {
  searchDefaultCompetition();
  searchDefaultSeason();
});

watch(seasonReady, (ready) => {
  if (ready) {
    grandPrixService.getGrandPrixesList(season.value).then((list) => {
      const activeGps = list.filter(gp => !gp.suspended);
      const gpsWithDates = activeGps.filter(gp => !Number.isNaN(gp.lastDate().getTime()));
      allGps.value.push(...activeGps);

      const firstDate = gpsWithDates.at(0)!.firstDate();
      const lastDate = gpsWithDates.at(gpsWithDates.length - 1)!.lastDate();

      firstEventYear.value = humanMonth(firstDate).toUpperCase() + " " + lastDate.getFullYear();
      lastEventYear.value = humanMonth(lastDate).toUpperCase() + " " + lastDate.getFullYear();

      emitter.emit("breadcrumbLastname", "Lista de Grandes Premios de " + season.value.name);
    });
  }
});

competition.value = { code: route.params.competition as string } as Competition;
season.value = { name: route.params.season as string } as Season;

if (competition.value.code) {
  competitionReady.value = true;
} else {
  shouldSearchDefaultCompetition.value = true;
}

if (season.value.name) {
  seasonReady.value = true;
} else {
  shouldSearchDefaultSeason.value = true;
}

searchDefaultCompetition();
searchDefaultSeason();

defineExpose({
  humanDayMonth,
  isThisWeek,
  activeTab,
  nextEvents,
  pastEvents,
});
</script>

<style scoped lang="scss">
.timeline .timeline-item {
    padding-bottom: 0!important;
}
</style>
