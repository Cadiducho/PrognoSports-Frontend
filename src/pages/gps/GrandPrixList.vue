<template>
  <PTitle name="Grandes Premios" />

  <PCard
    id="gplist"
  >
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-12">
      <div class="order-2 lg:order-1 lg:col-span-8">
        <PTabs
          v-if="seasonReady && competitionReady"
          v-model="activeTab"
        >
          <template #tabs>
            <PTabItem
              label="Todos"
              name="0"
            />
            <PTabItem
              label="Próximos"
              name="1"
            />
            <PTabItem
              label="Pasados"
              name="2"
            />
          </template>
          <PTabPanel name="0">
            <GrandPrixesList :gps="allGps" />
          </PTabPanel>
          <PTabPanel name="1">
            <GrandPrixesList :gps="nextEvents" />
          </PTabPanel>
          <PTabPanel name="2">
            <GrandPrixesList :gps="pastEvents" />
          </PTabPanel>
        </PTabs>
        <loading v-else />
      </div>
      <div class="order-1 lg:order-2 lg:col-span-4">
        <PTimeline v-if="allGps && allGps.length">
          <header class="w-16 text-center">
            <PTag color="info">
              {{ firstEventYear }}
            </PTag>
          </header>
          <PTimelineItem
            v-for="(gp, index) in allGps"
            :key="gp.name + index"
            class="!pb-0"
            :variant="timelineVariant(gp)"
            :icon="isThisWeek(gp.lastDate()) ? 'fa fa-flag' : undefined"
          >
            <router-link :to="gp.gpLink()">
              <div class="text-gray-700 dark:text-white">
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
          </PTimelineItem>
          <header class="mt-4 w-16 text-center">
            <PTag color="info">
              {{ lastEventYear }}
            </PTag>
          </header>
        </PTimeline>
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
import PTabPanel from "@/components/lib/PTabPanel.vue";
import PTag from "@/components/lib/PTag.vue";
import PTitle from "@/components/lib/PTitle.vue";
import PTimeline from "@/components/lib/PTimeline.vue";
import PTimelineItem from "@/components/lib/PTimelineItem.vue";
import { useCommunityStore } from "@/store/communityStore";
import { Competition } from "@/types/Competition";
import { GrandPrix } from "@/types/GrandPrix";
import { Season } from "@/types/Season";
import PTabs from "@/components/lib/PTabs.vue";
import PTabItem from "@/components/lib/PTabItem.vue";

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
const activeTab = ref('0');

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

const timelineVariant = (gp: GrandPrix) => {
  if (isThisWeek(gp.lastDate())) return 'danger';
  if (isBefore(gp.lastDate()) || Number.isNaN(gp.lastDate().getTime())) return 'warning';
  return 'primary';
};

defineExpose({
  humanDayMonth,
  isThisWeek,
  activeTab,
  nextEvents,
  pastEvents,
});
</script>
