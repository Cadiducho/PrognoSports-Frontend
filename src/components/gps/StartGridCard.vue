<template>
  <div>
    <component
      :is="selectable ? 'button' : 'div'"
      :type="selectable ? 'button' : undefined"
      :aria-pressed="selectable ? selected : undefined"
      class="flex min-h-11 w-full flex-wrap items-center gap-x-1.5 gap-y-0.5 rounded-md border border-t-4 px-2 py-1 text-left text-slate-900 dark:text-slate-100"
      :class="[
        selectable ? 'cursor-pointer transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500' : '',
        gridPos.isFromPit ? 'border-dashed border-info-300 dark:border-info-700' : 'border-gray-200 dark:border-gray-700',
        selected
          ? (gridPos.isFromPit ? 'bg-info-50 dark:bg-info-900/30' : 'bg-brand-50 dark:bg-brand-900/30') + ' ring-2 ring-brand-500'
          : 'bg-white dark:bg-slate-800'
      ]"
      :style="cardStyle"
      @click="selectable && emit('select')"
    >
      <span
        class="w-6 shrink-0 text-xs font-bold"
        :class="gridPos.isFromPit ? 'text-info-700 dark:text-info-300' : 'text-gray-500 dark:text-gray-400'"
      >
        {{ gridPos.isFromPit ? 'PL' : `P${gridPos.position}` }}
      </span>

      <PTooltip
        :label="fullname(gridPos.driver)"
        class="shrink-0 text-[15px] font-bold"
      >
        {{ gridPos.driver.code }}
      </PTooltip>

      <!-- La nota completa se lee al pulsar la casilla, en el detalle del piloto -->
      <PTag
        v-if="gridPos.isFromPit || gridPos.note"
        :color="gridPos.isFromPit ? 'info' : 'warning'"
        appearance="soft"
        size="small"
        class="shrink-0"
        :aria-label="tagLabel"
      >
        <template v-if="penaltyText">
          ▼{{ penaltyPlaces === 'back' ? ' final' : penaltyPlaces }}
        </template>
        <i
          v-else
          class="fa-solid fa-circle-info"
          aria-hidden="true"
        />
      </PTag>

      <span
        class="ml-auto shrink-0 rounded px-1.5 py-px text-[11px] font-bold"
        :style="numberStyle"
      >
        {{ gridPos.driver.number }}
      </span>
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import {StartGridPosition} from "@/types/StartGridPosition";
import {Driver} from "@/types/Driver";
import {gridPenaltyPlaces} from "@/types/GridEntry";

import PTag from "@/components/lib/PTag.vue";
import PTooltip from "@/components/lib/PTooltip.vue";

defineOptions({ name: "StartGridCard" });

const { gridPos, selectable = false, selected = false } = defineProps<{
  gridPos: StartGridPosition;
  /** Si se puede pulsar para ver el detalle del piloto */
  selectable?: boolean;
  selected?: boolean;
}>();

const emit = defineEmits<{
  select: [];
}>();

function fullname(driver: Driver): string {
  return driver.firstname + " " + driver.lastname;
}

/** Blanco u oscuro, el que más contraste dé sobre el color de equipo (luminancia relativa) */
function readableTextColor(hex: string): string {
  const [red, green, blue] = [0, 2, 4].map((start) => {
    const channel = parseInt(hex.slice(start, start + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.4 ? "#111827" : "#ffffff";
}

const teamColor = computed(() => "#" + gridPos.driver.team.teamcolor);

// El borde superior lleva el color del equipo; en pit lane se mantiene sólido aunque el resto sea discontinuo
const cardStyle = computed(() => ({borderTopColor: teamColor.value, borderTopStyle: "solid" as const}));
const numberStyle = computed(() => ({backgroundColor: teamColor.value, color: readableTextColor(gridPos.driver.team.teamcolor)}));

// Una sanción en posiciones va escrita al principio de la nota
const penaltyPlaces = computed(() => gridPos.isFromPit ? undefined : gridPenaltyPlaces(gridPos.note ?? ''));
const penaltyText = computed(() => penaltyPlaces.value === undefined
  ? undefined
  : penaltyPlaces.value === 'back' ? 'Sanción de final de parrilla' : `Sanción de ${penaltyPlaces.value} posiciones`);
const tagLabel = computed(() => gridPos.isFromPit ? 'Sale desde pit lane' : penaltyText.value ?? 'Tiene una nota');

defineExpose({ gridPos, fullname, cardStyle, numberStyle });
</script>
