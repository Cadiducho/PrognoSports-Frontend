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
import {defineComponent} from "vue";

export default defineComponent({
    name: "PointsTooltipComponent",
    props: {
        gpName: {
            type: String
        },
        displayPoints: {
            type: Number
        },
        userPoints: {
            type: Object
        }

    }
});
</script>