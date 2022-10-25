<template>
    <div class="tile" v-if="noNextGp">
        <article class="tile is-child box">
            <p class="title">Próximo Gran Premio</p>
            <p class="content block">
                No hay próximo Gran Premio
            </p>
        </article>
    </div>
    <router-link v-else-if="!loadingGpData" :to="nextGp.gpLink()">
        <div class="card" >
            <div class="card-content">
                <p class="subtitle has-text-weight-bold">Próximo Gran Premio</p>
                <p class="title">{{nextGp.name}}</p>
                <figure class="image is-4by3">
                    <img v-if="nextGp.hasPromoImage" :src="nextGp.promoImage()">
                </figure>
            </div>
            <div class="card-content">
                <div class="columns">
                    <div class="column">
                        <p class="title is-4">{{ nextGp.circuit.name }}</p>
                        <p class="subtitle mb-0">{{ nextGp.circuit.locality }} ({{ nextGp.circuit.country }})</p>
                        <p class="subtitle mt-0">Ronda #{{ nextGp.round }}</p>
                    </div>
                    <div class="column">
                        <p class="content block">
                            <span v-for="session in nextGp.sessions">
                                <b>{{ session.humanName() }}:</b> {{ humanDate(session.date) }} ({{ dateDiff(session.date) }}) <br />
                            </span>
                        </p>
                    </div>
                </div>

                <footer class="card-footer">
                    <o-button tag="router-link"
                              :to="nextGp.gpLink()"
                              variant="info light" expanded>
                        Pronosticar
                    </o-button>
                </footer>
            </div>
        </div>
    </router-link>
</template>

<script lang="ts">
    import {GrandPrix} from "@/types/GrandPrix";

    import {defineComponent} from "vue";
    import {useCommunityStore} from "@/store/communityStore";
    import {isValidCommunity} from "@/utils";
    import {grandPrixService} from "@/_services";
    import {useDayjs} from "@/composables/useDayjs";

    export default defineComponent({
        name: "NextGrandPrix",
        setup() {
            const dayjs = useDayjs();
            const communityStore = useCommunityStore();

            const humanDate = dayjs.humanDate;
            const dateDiff = dayjs.dateDiff;
            const currentCommunity = communityStore.community;
            return { currentCommunity, humanDate, dateDiff };
        },
        data() {
            return {
                nextGp: {} as GrandPrix,
                noNextGp: false,
                loadingGpData: true,
            }
        },
        mounted() {
            if (isValidCommunity(this.currentCommunity)) {
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