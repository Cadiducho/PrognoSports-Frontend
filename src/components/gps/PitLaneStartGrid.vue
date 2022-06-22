<template>
    <div class="card mt-2" v-if="thereIsPitLaneExits() || thereIsGridChanges()">
        <div v-if="thereIsPitLaneExits()" class="card-content content mb-0 pb-0">
            <h5>Salidas desde Pit Lane</h5>
            <div class="columns">

                <div class="column is-6">
                    <div v-for="pos in parrillaPitLane">
                        <StartGridCard :gridPos="pos" class="mb-2"/>
                    </div>
                </div>
                <div class="column is-6"></div>
            </div>
        </div>

        <div v-if="thereIsGridChanges()" class="card-content content mt-0 pt-0">
            <hr class="hr">
            <h5>Notas sobre el cambio de la parrilla: </h5>
            <ul>
                <li v-for="gridPosition in grid.get(chosenSession)" v-if="gridPosition.note !== undefined">
                    <b>{{gridPosition.driver.lastname}} #{{gridPosition.driver.number}}</b>: {{gridPosition.note}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import {StartGridPosition} from "@/types/StartGridPosition";
import StartGridCard from "@/components/gps/StartGridCard.vue";
import {RaceSession} from "@/types/RaceSession";

import {defineComponent, PropType} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import useEmitter from "@/composables/useEmitter";

export default defineComponent({
    name: "PitLaneStartGrid",
    components: {StartGridCard},
    props: {
        grid: {
            type: Map as PropType<Map<RaceSession, Array<StartGridPosition>>>,
            required: true,
        }
    },
    setup() {
        const emitter = useEmitter();
        const authStore = useAuthStore();
        const communityStore = useCommunityStore();

        const currentUser = authStore.user;
        const currentCommunity = communityStore.community;
        return { currentUser, currentCommunity, emitter };
    },
    data() {
        return {
            chosenSession: {} as RaceSession
        }
    },
    mounted() {
        this.chosenSession = this.grid.keys().next().value;

        this.emitter.on('changeGridSession', (session: RaceSession) => {
            this.chosenSession = session;
        });
    },
    methods: {
        thereIsPitLaneExits() {
            return this.grid.get(this.chosenSession)?.some((gridPos => gridPos.isFromPit));
        },
        thereIsGridChanges() {
            return this.grid.get(this.chosenSession)?.some((gridPos => gridPos.note !== undefined));
        }
    },
    computed: {
        parrillaPitLane(): StartGridPosition[] | undefined {
            return this.grid.get(this.chosenSession)?.filter((gridPos: StartGridPosition) => {
                return gridPos.isFromPit;
            });
        }
    }
});
</script>