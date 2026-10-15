<template>
  <PTooltip>
    {{ userPoints.hitsInGP }}

    <template #tooltip>
      <ul>
        <li><b>{{ gpName }}</b></li>

        <li
          v-for="(hits, session) in userPoints.hitsBySession"
          :key="session"
        >
          <b>{{ sessionHumanName(Number(session)) }}</b>: {{ hits }} aciertos
        </li>
        <li>
          <b>Aciertos totales</b>: {{ userPoints.hitsInGP }}
        </li>
      </ul>
    </template>
  </PTooltip>
</template>

<script setup lang="ts">
import { UserPoints } from "@/types/UserPoints";
import PTooltip from "@/components/lib/PTooltip.vue";
import {sessionHumanNameById} from "@/utils/raceSession";

defineProps<{
  gpName: string;
  userPoints: UserPoints;
}>();

function sessionHumanName(id: number) {
  return sessionHumanNameById(id) ?? "Desconocida";
}
</script>

