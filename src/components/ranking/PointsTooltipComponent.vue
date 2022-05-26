<template>
    <o-tooltip multilined>
        <template v-slot:content>
            <ul>
                <li><b>{{ gpName }}</b></li>
                <li>
                    <b>Clasificación</b>: {{ userPoints.pointsInQualify }}
                </li>
                <li>
                    <b>Carrera</b>: {{ userPoints.pointsInRace }}
                </li>
                <li>
                    <b>Gran Premio</b>: {{ userPoints.pointsInGP }}
                </li>
                <li>
                    <b>Acumulados</b>: {{ userPoints.accumulatedPoints }}
                </li>
            </ul>
        </template>

        {{ displayPoints }}
    </o-tooltip>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {UserPoints} from "@/types/UserPoints";

@Component
export default class PointsTooltipComponent extends Vue {
    @Prop({required: true}) gpName!: string;
    @Prop({required: true}) displayPoints!: number;
    @Prop({required: true}) userPoints!: UserPoints;
}
</script>