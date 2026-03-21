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
import { RaceSession } from "@/types/RaceSession";
import PTooltip from "@/components/lib/PTooltip.vue";

defineProps<{
  gpName: string;
  userPoints: UserPoints;
}>();

function sessionHumanName(id: number) {
  return RaceSession.findById(id)?.humanName() ?? "Desconocida";
}
</script>

