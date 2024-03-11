<template>
    <PCard v-if="noNextGp">
        <PTitle type="subtitle">Próximo Gran Premio</PTitle>
        <PTitle tag="p">No hay próximo Gran Premio</PTitle>
    </PCard>

    <PCard v-else-if="!loadingGpData" class="text-black no-underline">
        <PTitle type="subtitle" tag="h2">Próximo Gran Premio</PTitle>
        <PTitle tag="h1">{{ nextGp.name }}</PTitle>
        <figure v-if="nextGp.hasPromoImage" class="max-w-lg">
            <img class="h-auto max-w-full rounded-lg" :src="nextGp.promoImage()" alt="Next grand prix promo image">
        </figure>
        <hr v-else>


        <h3 class="text-2xl font-semibold mt-5">{{ nextGp.circuit?.name }} - Ronda #{{ nextGp.round }}</h3>
        <p class="text-lg font-semibold">{{ nextGp.circuit?.locality }} ({{ nextGp.circuit?.country }})</p>
        <ul class="list-disc list-inside " v-for="session in nextGp.sessions">
            <li>
                <b class="-ml-2">{{ session.humanName() }}:</b> {{ humanDateTime(session.date) }} ({{ dateDiff(session.date) }})
            </li>
        </ul>

        <PButton expanded tag="router-link" :to="nextGp.gpLink()" color="primary" class="mt-5">Pronosticar</PButton>
    </PCard>
</template>

<script lang="ts">
    import {GrandPrix} from "@/types/GrandPrix";

    import {defineComponent} from "vue";
    import {useCommunityStore} from "@/store/communityStore";
    import {grandPrixService} from "@/_services";
    import {useDayjs} from "@/composables/useDayjs";
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
            return { currentCommunity, thereIsCurrentCommunity, humanDateTime, dateDiff };
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