<template>
    <PCard v-if="noNextGp">
        <PTitle type="subtitle">Próximo Gran Premio</PTitle>
        <PTitle tag="p">No hay próximo Gran Premio</PTitle>
    </PCard>

    <PCard v-else-if="!loadingGpData" class="text-gray-900 no-underline dark:text-gray-100">
        <PTitle type="subtitle" tag="h2">Próximo Gran Premio</PTitle>
        <PTitle tag="h1">{{ nextGp.name }}</PTitle>
        <figure v-if="nextGp.hasPromoImage" class="max-w-lg">
            <img class="h-auto max-w-full rounded-lg" :src="grandPrixPromoImageUrl(nextGp)" alt="Next grand prix promo image">
        </figure>
        <hr v-else>


        <h3 class="text-2xl font-semibold mt-5">{{ nextGp.circuit?.name }} - Ronda #{{ nextGp.round }}</h3>
        <p class="text-lg font-semibold">{{ nextGp.circuit?.locality }} ({{ nextGp.circuit?.country }})</p>
        <ul class="list-disc list-inside " v-for="session in nextGp.sessions">
            <li>
                <b class="-ml-2">{{ sessionHumanName(session) }}:</b> {{ humanDateTime(session.date) }} ({{ dateDiff(session.date) }})
            </li>
        </ul>

        <PButton expanded tag="router-link" :to="grandPrixLink(nextGp)" color="primary" class="mt-5">Pronosticar</PButton>
    </PCard>
</template>

<script lang="ts">
    import {GrandPrix} from "@/types/GrandPrix";
    import {grandPrixLink, grandPrixPromoImageUrl} from "@/utils/grandPrix";

    import {defineComponent} from "vue";
    import {useCommunityStore} from "@/store/communityStore";
    import {grandPrixService} from "@/_services";
    import {useDayjs} from "@/composables/useDayjs";
    import {sessionHumanName} from "@/utils/raceSession";
    import PCard from "@/components/lib/PCard.vue";
    import PTitle from "@/components/lib/PTitle.vue";
    import PButton from "@/components/lib/forms/PButton.vue";

    export default defineComponent({
        name: "NextGrandPrix",
        components: {PButton, PTitle, PCard},
        setup() {
            const dayjs = useDayjs();
            const communityStore = useCommunityStore();

            const humanDateTime = dayjs.humanDateTime;
            const dateDiff = dayjs.dateDiff;
            const thereIsCurrentCommunity = communityStore.thereIsCurrentCommunity;
            const currentCommunity = communityStore.currentCommunity;
            return { currentCommunity, thereIsCurrentCommunity, humanDateTime, dateDiff, sessionHumanName, grandPrixLink, grandPrixPromoImageUrl };
        },
        data() {
            return {
                nextGp: {} as GrandPrix,
                noNextGp: false,
                loadingGpData: true,
            }
        },
        mounted() {
            if (this.thereIsCurrentCommunity) {
                this.fetchNextGrandPrixData();
            }
        },
        watch: {
            currentCommunity(newCommunity, oldcommunity) {
                this.fetchNextGrandPrixData();
            }
        },
        methods: {
            fetchNextGrandPrixData() {
                grandPrixService.getNextGrandPrix(this.currentCommunity.competition).then(nextGp => {
                    this.nextGp = nextGp;
                }).catch(() => {
                    this.noNextGp = true;
                }).finally(() => this.loadingGpData = false);
            }
        }
    });
</script>