<template>
  <h6 class="dark:text-gray-300">
    La hora de cierre de este pronóstico para la <span class="font-bold dark:text-gray-200">{{ props.session.humanName() }}</span>
    es {{ humanDateTime(props.session.closureDate()) }} ({{ dateDiff(props.session.closureDate()) }})
  </h6>
</template>

<script setup lang="ts">

import {RaceSession} from "@/types/RaceSession";
import {useDayjs} from "@/composables/useDayjs";

const props = defineProps({
  session: { type: RaceSession, required: true },
})
const dayjs = useDayjs();

const dateDiff = dayjs.dateDiff;
const humanDateTime = dayjs.humanDateTime;
</script>
