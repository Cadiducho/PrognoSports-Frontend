<template>
    <div class="card" v-if="thereIsPitLaneExits() || thereIsGridChanges()">
        <div v-if="thereIsPitLaneExits()" class="card-content content">
            <h5>Salidas desde Pit Lane</h5>
            <div v-for="pos in parrillaPitLane">
                <StartGridCard :gridPos="pos"/>
                <div class="block"></div>
            </div>
        </div>

        <div v-if="thereIsGridChanges()" class="card-content content">
            <div class="block"></div>
            <hr class="hr">
            <h5>Notas sobre el cambio de la parrilla</h5>
            <ul>
                <li v-for="gridPosition in grid" v-if="gridPosition.note !== undefined">
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
@Component({
    components: {StartGridCard}
})
export default class PitLaneStartGrid extends Vue {
    @Prop() grid!: Array<StartGridPosition>;

    get parrillaPitLane() {
        return this.grid.filter(function (gridPos) {
            return gridPos.isFromPit;
        })
    }

    public thereIsPitLaneExits() {
        return this.grid.some((gridPos => gridPos.isFromPit));
    }

    public thereIsGridChanges() {
        return this.grid.some((gridPos => gridPos.note !== undefined));
    }

}
</script>