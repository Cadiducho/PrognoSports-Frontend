<template>
  <PTooltip>
    {{ props.displayPoints }}

    <template #tooltip>
      <ul>
        <li><b>{{ props.gpName }}</b></li>

        <li
          v-for="(points, session) in props.userPoints.pointsBySession"
          :key="session"
        >
          <b>{{ sessionHumanName(session) }}</b>: {{ points }}
        </li>
        <li>
          <b>Gran Premio</b>: {{ props.userPoints.pointsInGP }}
        </li>
        <li>
          <b>Acumulados</b>: {{ props.userPoints.accumulatedPoints }}
        </li>
      </ul>
    </template>
  </PTooltip>
</template>

<script setup lang="ts">
import {UserPoints} from "@/types/UserPoints";
import {RaceSession} from "@/types/RaceSession";
import PTooltip from "@/components/lib/PTooltip.vue";

const props = defineProps<{
    gpName: string,
    displayPoints: number,
   userPoints: UserPoints,
}>();

function sessionHumanName(id: number) {
    return RaceSession.findById(id)?.humanName() ?? "Desconocida";
}
</script>
