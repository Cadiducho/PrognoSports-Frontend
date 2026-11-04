<script setup lang="ts">
import { computed } from "vue";
import type { GrandPrix } from "@/types/GrandPrix";
import type { NextGrandPrixSession } from "@/composables/useNextGrandPrix";
import { useDayjs } from "@/composables/useDayjs";
import PTag from "@/components/lib/PTag.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import {grandPrixLink} from "@/utils/grandPrix";
import {sessionHumanName} from "@/utils/raceSession";

const props = defineProps<{
  grandPrix: GrandPrix;
  row: NextGrandPrixSession;
}>();

const { formatDate } = useDayjs();

// El GP abre la sesión indicada en `sesion`
const to = computed(() => ({ ...grandPrixLink(props.grandPrix), query: { sesion: props.row.session.name } }));

const day = computed(() => formatDate(props.row.session.date, "ddd").replace(".", ""));
const date = computed(() => formatDate(props.row.session.date, "D"));
const time = computed(() => formatDate(props.row.session.date, "H:mm"));

const tag = computed(() => {
  switch (props.row.status) {
    case "done":
      return { label: "Hecho", color: "success" as const };
    case "closing":
      return { label: "Cierra pronto", color: "error" as const };
    case "closed":
      return { label: "Cerrada", color: "neutral" as const };
    default:
      return { label: "Pendiente", color: "neutral" as const };
  }
});

const action = computed(() => {
  if (props.row.closed) {
    return { label: "Ver", type: "ghost" as const };
  }
  return props.row.done ? { label: "Editar", type: "outline" as const } : { label: "Pronosticar", type: "solid" as const };
});
</script>

<template>
  <li
    class="relative flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60 md:gap-4"
    :class="row.status === 'closing'
      ? 'border-error-300 dark:border-error-700'
      : 'border-gray-200 dark:border-gray-700'"
  >
    <div class="hidden w-12 flex-none flex-col items-center text-center md:flex">
      <span class="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">{{ day }}</span>
      <span class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ date }}</span>
    </div>

    <span
      class="flex h-7 w-7 flex-none items-center justify-center rounded-full text-sm font-bold md:hidden"
      :class="row.done
        ? 'bg-success-100 text-success-800 dark:bg-success-900/40 dark:text-success-200'
        : 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200'"
      aria-hidden="true"
    >
      {{ row.done ? "✓" : "•" }}
    </span>

    <div class="min-w-0 flex-1">
      <router-link
        :to="to"
        class="font-semibold text-gray-900 after:absolute after:inset-0 after:content-[''] dark:text-gray-100"
      >
        {{ sessionHumanName(row.session) }}
      </router-link>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        <span class="md:hidden">{{ day }} {{ date }} · </span>{{ time }} ·
        <template v-if="row.closed">
          cerrada
        </template>
        <template v-else>
          cierre en <b :class="row.status === 'closing' ? 'text-error-700 dark:text-error-300' : ''">{{ row.closesIn }}</b>
        </template>
      </p>
    </div>

    <PTag
      :color="tag.color"
      appearance="soft"
      variant="rounded"
      size="small"
      class="hidden flex-none sm:inline-flex"
    >
      {{ tag.label }}
    </PTag>

    <!-- El enlace de la fila ya cubre todo el área; el botón es solo una pista visual en escritorio -->
    <PButton
      :type="action.type"
      size="small"
      class="pointer-events-none hidden w-28 flex-none justify-center md:inline-flex"
      tabindex="-1"
      aria-hidden="true"
    >
      {{ action.label }}
    </PButton>
    <span
      class="flex-none text-sm font-semibold text-brand-700 dark:text-brand-300 md:hidden"
      aria-hidden="true"
    >
      {{ action.label }} ›
    </span>
  </li>
</template>
