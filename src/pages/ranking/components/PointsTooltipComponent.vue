<template>
  <PTooltip>
    {{ displayPoints }}

    <template #tooltip>
      <ul>
        <li><b>{{ gpName }}</b></li>

        <li
          v-for="(points, session) in userPoints.pointsBySession"
          :key="session"
        >
          <b>{{ sessionHumanName(Number(session)) }}</b>: {{ points }}
        </li>
        <li>
          <b>Bonus de aciertos: </b> {{ userPoints.bonusPoints }} ({{ userPoints.hitsInGP }} aciertos)
        </li>
        <li>
          <b>Gran Premio</b>: {{ userPoints.pointsInGP }}
        </li>
        <li>
          <b>Acumulados</b>: {{ userPoints.accumulatedPoints }}
        </li>
      </ul>
    </template>
  </PTooltip>
</template>

<script setup lang="ts">
import { UserPoints } from "@/types/UserPoints";
import { RaceSession } from "@/types/RaceSession";
import PTooltip from "@/components/lib/PTooltip.vue";

defineProps<{
  gpName: string;
  displayPoints: number;
  userPoints: UserPoints;
}>();

function sessionHumanName(id: number) {
  return RaceSession.findById(id)?.humanName() ?? "Desconocida";
}
</script>

