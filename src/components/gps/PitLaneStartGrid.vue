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
import {Component, Prop, Vue} from "vue-property-decorator";
import {StartGridPosition} from "@/types/StartGridPosition";
import StartGridCard from "@/components/gps/StartGridCard.vue";
import {RaceSession} from "@/types/RaceSession";
import EventBus from "@/plugins/eventbus";
@Component({
    components: {StartGridCard}
})
export default class PitLaneStartGrid extends Vue {
    @Prop({required: true}) grid!: Map<RaceSession, Array<StartGridPosition>>;

    private chosenSession: RaceSession = {} as RaceSession;

    mounted() {
        this.chosenSession = this.grid.keys().next().value;

        EventBus.$on('changeGridSession', (session: RaceSession) => {
            this.chosenSession = session;
        });
    }


    get parrillaPitLane() {
        return this.grid.get(this.chosenSession)?.filter(function (gridPos) {
            return gridPos.isFromPit;
        })
    }

    public thereIsPitLaneExits() {
        return this.grid.get(this.chosenSession)?.some((gridPos => gridPos.isFromPit));
    }

    public thereIsGridChanges() {
        return this.grid.get(this.chosenSession)?.some((gridPos => gridPos.note !== undefined));
    }

}
</script>