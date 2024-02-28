<template>
    <o-tooltip multilined>
        <template v-slot:content>
            <ul>
                <li><b>{{ gpName }}</b></li>

                <li v-for="(points, session) in userPoints.pointsBySession">
                    <b>{{ sessionHumanName(session) }}</b>: {{ points }}
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
import {defineComponent, PropType} from "vue";
import {UserPoints} from "@/types/UserPoints";
import {RaceSession} from "@/types/RaceSession";

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
            type: Object as PropType<UserPoints>,
            required: true
        }
    },
    methods: {
        sessionHumanName(id: number) {
            return RaceSession.findById(id)?.humanName() ?? "Desconocida";
        }
    }
});
</script>