<template>
    <div id="startGridComponent" class="box" v-if="grid !== undefined">
        <h3>Parrilla de Salida</h3>
        <div class="columns">
            <div class="column is-6">
                <StartGridCard v-for="pos in parrillaDerecha" v-bind:key="pos.position"/>
                <div v-for="pos in parrillaIzquierda">
                    <StartGridCard :gridPos="pos"/>
                    <div class="block"></div>
                </div>
            </div>
            <div class="column is-6">
                <div class="block"></div>
                <div v-for="pos in parrillaDerecha">
                    <StartGridCard :gridPos="pos"/>
                    <div class="block"></div>
                </div>
            </div>
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
    export default class StartGridList extends Vue {
        @Prop({required: true}) grid!: Array<StartGridPosition>;

        get parrillaIzquierda() {
            return this.grid.filter(function (gridPos) {
                return gridPos.position % 2 !== 0 && !gridPos.isFromPit;
            })
        }

        get parrillaDerecha() {
            return this.grid.filter(function (gridPos) {
                return gridPos.position % 2 === 0  && !gridPos.isFromPit;
            })
        }
    }
</script>