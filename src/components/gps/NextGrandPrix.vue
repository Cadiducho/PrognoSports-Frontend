<template>
    <div id="cardNextGP">
        <div class="tile" v-if="noNextGp">
            <article class="tile is-child box">
                <p class="title">Próximo Gran Premio</p>
                <p class="content block">
                    No hay próximo Gran Premio
                </p>
            </article>
        </div>
        <div class="tile" v-else-if="!loadingGpData">
            <article class="tile is-child box">
                <p class="title">Próximo Gran Premio</p>
                <p class="subtitle">{{nextGp.name}}</p>
                <figure class="image is-4by3">
                    <img v-if="nextGp.promo_image_url !== undefined" :src="nextGp.promo_image_url">
                </figure>
                <p class="content block">
                    {{nextGp.laps}} vueltas a {{nextGp.circuit.name}}.
                </p>
                <p class="content block">
                    <span v-for="session in nextGp.sessions">
                        <b>{{ session.humanName() }}:</b> {{ humanDate(session.date) }} ({{ dateDiff(session.date) }}) <br />
                    </span>
                </p>
                <footer class="card-footer">
                    <o-button tag="router-link"
                              :to="gpLink"
                              variant="info light" expanded>
                        Pronosticar
                    </o-button>
                </footer>
            </article>
        </div>
        <div class="tile" v-else>
            <article class="tile is-child box">
                <p class="title">Próximo Gran Premio</p>
                <loading />
            </article>
        </div>
    </div>
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
        computed: {
            gpLink(): any {
                return {
                    name: "gpdetails",
                    params: {
                        competition: this.currentCommunity.competition.code,
                        season: this.nextGp?.season.name,
                        id: this.nextGp?.id,
                    }
                }
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