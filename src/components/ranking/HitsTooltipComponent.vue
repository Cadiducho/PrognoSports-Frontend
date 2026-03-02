<template>
  <PTooltip>
    {{ props.userPoints.hitsInGP }}

    <template #tooltip>
      <ul>
        <li><b>{{ props.gpName }}</b></li>

        <li
          v-for="(hits, session) in props.userPoints.hitsBySession"
          :key="session"
        >
          <b>{{ sessionHumanName(session) }}</b>: {{ hits }} aciertos
        </li>
        <li>
          <b>Aciertos totales</b>: {{ props.userPoints.hitsInGP }}
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
  userPoints: UserPoints,
}>();

function sessionHumanName(id: number) {
  return RaceSession.findById(id)?.humanName() ?? "Desconocida";
}
</script>
