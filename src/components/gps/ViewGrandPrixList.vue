<template>
    <div id="gplist" class="box">

        <progno-page-title name="Grandes Premios" />

        <div class="columns is-variable is-5">
            <div class="column is-8">
                <o-tabs v-model="activeTab" v-if="seasonReady && competitionReady">
                    <o-tab-item label="Próximos" :value="0">
                        <GrandPrixesList :competition="competition" :season="season" searchType="next"/>
                    </o-tab-item>

                    <o-tab-item label="Pasados" :value="1">
                        <GrandPrixesList :competition="competition" :season="season" searchType="past"/>
                    </o-tab-item>

                    <o-tab-item label="Todos" :value="2">
                        <GrandPrixesList :competition="competition" :season="season" searchType="all"/>
                    </o-tab-item>
                </o-tabs>
                <loading v-else />
            </div>
            <div class="column is-4">
                <NextGrandPrix />
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
    import NextGrandPrix from "@/components/gps/NextGrandPrix.vue";
    import GrandPrixesList from "@/components/gps/GrandPrixesList.vue";
    import {Competition} from "@/types/Competition";
    import {Season} from "@/types/Season";
    import {seasonService} from "@/_services";

    import {defineComponent} from "vue";
    import {useCommunityStore} from "@/store/communityStore";

    export default defineComponent({
        name: "ViewGrandPrixList",
        components: {
            GrandPrixesList,
            NextGrandPrix,
            PrognoPageTitle
        },
        setup() {
            const communityStore = useCommunityStore();

            const currentCommunity = communityStore.community;
            return { currentCommunity };
        },
        data() {
            return {
                competition: {} as Competition,
                season: {} as Season,

                shouldSearchDefaultCompetition: false,
                shouldSearchDefaultSeason: false,
                activeTab: 0,

                competitionReady: false,
                seasonReady: false
            }
        },
        created() {
            this.competition = { code: this.$route.params.competition } as Competition;
            this.season = { name: this.$route.params.season } as Season;

            if (this.competition.code == undefined) {
                this.shouldSearchDefaultCompetition = true;
            } else {
                this.competitionReady = true;
            }

            if (this.season.name == undefined) {
                this.shouldSearchDefaultSeason = true;
            } else {
                this.seasonReady = true;
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
                    this.competitionReady = true;
                }
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
                }
            }
        },
        watch: {
            currentCommunity(newCommunity, oldCommunity) {
                this.searchDefaultCompetition();
                this.searchDefaultSeason();
            }
        },
    });
</script>
