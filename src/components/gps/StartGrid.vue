<template>
    <div id="startGridComponent">
        <div class="columns">
            <div class="column is-6">
                <div v-for="pos in parrillaIzquierda">
                    Piloto {{pos.driver.firstname}}
                </div>
            </div>
            <div class="column is-6">
                <div v-for="pos in parrillaDerecha">
                    Piloto {{pos.driver.firstname}}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {StartGridPosition} from "@/types/StartGridPosition";

    @Component
    export default class StartGrid extends Vue {
        @Prop({required: true}) grid!: Array<StartGridPosition>;

        get parrillaIzquierda() {
            return this.grid.filter(function (gridPos) {
                return gridPos.position % 2 !== 0;
            })
        }

        get parrillaDerecha() {
            return this.grid.filter(function (gridPos) {
                return gridPos.position % 2 === 0;
            })
        }

    }
</script>