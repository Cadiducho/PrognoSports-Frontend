<template>
    <div id="gplist" class="box">

        <progno-page-title name="Grandes Premios" />

        <div class="columns is-variable is-5">
            <div class="column is-8">
                <o-tabs v-model="activeTab" v-if="seasonReady && competitionReady">

                    <o-tab-item label="Todos" :value="0">
                        <GrandPrixesList :gps="allGps"/>
                    </o-tab-item>

                    <o-tab-item label="Próximos" :value="1">
                        <GrandPrixesList :gps="nextEvents"/>
                    </o-tab-item>

                    <o-tab-item label="Pasados" :value="2">
                        <GrandPrixesList :gps="pastEvents"/>
                    </o-tab-item>

                </o-tabs>
                <loading v-else />
            </div>
            <div class="column is-4">
                <div v-if="allGps && allGps.length" class="timeline">
                    <header class="timeline-header">
                        <span class="tag is-medium is-info">{{ firstEventYear }}</span>
                    </header>
                    <div class="timeline-item"
                         v-for="gp in allGps"
                         :class="{
                             'is-primary': isAfter(gp.lastDate()),
                             'is-danger': isThisWeek(gp.lastDate()),
                             'is-warning': isBefore(gp.firstDate()),
                         }" >

                        <div v-if="isThisWeek(gp.lastDate())"  class="timeline-marker is-danger is-icon">
                            <i class="fa fa-flag"></i>
                        </div>
                        <div v-else-if="isBefore(gp.lastDate()) || Number.isNaN(gp.lastDate().getTime())" class="timeline-marker is-warning"></div>
                        <div v-else class="timeline-marker is-primary"></div>

                        <router-link :to="gp.gpLink()" >
                            <div class="timeline-content">
                                <p>
                                    <span v-if="Number.isNaN(gp.firstDate().getDate())">Sin fecha</span>
                                    <span v-else>{{ gp.firstDate().getDate() }} - {{ humanDayMonth(gp.lastDate()) }}</span>
                                    <span v-if="isThisWeek(gp.lastDate())" class="tag is-light is-danger heading ml-1">
                                        Próximo
                                    </span>
                                </p>
                                <p>{{ gp.name }}</p>
                            </div>
                        </router-link>
                    </div>
                    <div class="timeline-header">
                        <span class="tag is-medium is-info">{{ lastEventYear }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
    import NextGrandPrix from "@/components/gps/NextGrandPrix.vue";
    import GrandPrixesList from "@/components/gps/list/GrandPrixesList.vue";
    import {Competition} from "@/types/Competition";
    import {Season} from "@/types/Season";
    import {grandPrixService, seasonService} from "@/_services";

    import {defineComponent} from "vue";
    import {useCommunityStore} from "@/store/communityStore";
    import {GrandPrix} from "@/types/GrandPrix";
    import {useDayjs} from "@/composables/useDayjs";
    import useEmitter from "@/composables/useEmitter";

    export default defineComponent({
        name: "ViewGrandPrixList",
        components: {
            GrandPrixesList,
            NextGrandPrix,
            PrognoPageTitle
        },
        setup() {
            const communityStore = useCommunityStore();
            const dayjs = useDayjs();
            const emitter = useEmitter();

            const currentCommunity = communityStore.community;
            const humanDayMonth = dayjs.humanDayMonth;
            const humanMonth = dayjs.humanMonth;
            const isBefore = dayjs.isBefore;
            const isAfter = dayjs.isAfter;
            const isThisWeek = dayjs.isThisWeek;
            return { currentCommunity, emitter, humanDayMonth, humanMonth, isBefore, isAfter, isThisWeek };
        },
        data() {
            return {
                competition: {id: 0} as Competition,
                season: {id: 0} as Season,

                shouldSearchDefaultCompetition: false,
                shouldSearchDefaultSeason: false,
                activeTab: 0,

                competitionReady: false,
                seasonReady: false,

                allGps: new Array<GrandPrix>(),
                firstEventYear: "",
                lastEventYear: "",
            }
        },
        created() {
            this.competition = { code: this.$route.params.competition } as Competition;
            this.season = { name: this.$route.params.season } as Season;

            if (this.competition.code) {
                this.competitionReady = true;
            } else {
                this.shouldSearchDefaultCompetition = true;
            }

            if (this.season.name) {
                this.seasonReady = true;
            } else {
                this.shouldSearchDefaultSeason = true;
            }

            this.searchDefaultCompetition();
            this.searchDefaultSeason();
        },
        methods: {
            /**
             * Buscar la competición si no se ha especificado en la url. Esta saldrá de la comunidad actual
             */
            searchDefaultCompetition(): void {
                if (this.shouldSearchDefaultCompetition) {
                    this.competition = this.currentCommunity.competition;
                }
                this.competitionReady = true;
            },
            /**
             * Buscar la temporada actual de la competición buscada si esta no se ha especificado en la url
             */
            searchDefaultSeason(): void {
                if (this.shouldSearchDefaultSeason) {
                    seasonService.getCurrentSeason(this.currentCommunity.competition).then((season) => {
                        this.season = season;
                        this.seasonReady = true;
                    });
                } else {
                    this.seasonReady = true;
                }
            }
        },
        watch: {
            currentCommunity(newCommunity, oldCommunity) {
                this.searchDefaultCompetition();
                this.searchDefaultSeason();
            },
            seasonReady(seasonReady, oldSeasonReady) {
                if (seasonReady) {
                    grandPrixService.getGrandPrixesList(this.competition, this.season).then((list) => {
                        let activeGps = list.filter(gp => !gp.suspended);
                        let gpsWithDates = activeGps.filter(gp => !Number.isNaN(gp.lastDate().getTime()))
                        this.allGps.push(...activeGps);

                        const firstDate = gpsWithDates.at(0)!.firstDate();
                        const lastDate = gpsWithDates.at(gpsWithDates.length - 1)!.lastDate()

                        this.firstEventYear = this.humanMonth(firstDate).toUpperCase() + " " + lastDate.getFullYear();
                        this.lastEventYear = this.humanMonth(lastDate).toUpperCase() + " " + lastDate.getFullYear();

                        this.emitter.emit('breadcrumbLastname', "Lista de Grandes Premios de " + this.season.name);
                    });
                }
            },
        },
        computed: {
            nextEvents() {
                return this.allGps.filter(gp => this.isBefore(gp.firstDate()));
            },
            pastEvents() {
                return this.allGps.filter(gp => this.isAfter(gp.lastDate()));
            }
        }
    });
</script>
<style scoped lang="scss">
@import "bulma/sass/utilities/_all.sass";

.timeline .timeline-item {
    padding-bottom: 0!important;
}
.timeline-content {
    text-decoration: none;
    color: $grey-dark;
}
</style>
