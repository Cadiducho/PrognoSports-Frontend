<template>
  <h6 class="dark:text-gray-300">
    La hora de cierre de este pronóstico para la <span class="font-bold dark:text-gray-200">{{ sessionHumanName(props.session) }}</span>
    es {{ humanDateTime(sessionClosureDate(props.session)) }} ({{ dateDiff(sessionClosureDate(props.session)) }})
  </h6>
</template>

<script setup lang="ts">

import type {RaceSession} from "@/types/RaceSession";
import type {PropType} from "vue";
import {useDayjs} from "@/composables/useDayjs";
import {sessionClosureDate, sessionHumanName} from "@/utils/raceSession";

const props = defineProps({
  session: { type: Object as PropType<RaceSession>, required: true },
})
const dayjs = useDayjs();

const dateDiff = dayjs.dateDiff;
const humanDateTime = dayjs.humanDateTime;
</script>
