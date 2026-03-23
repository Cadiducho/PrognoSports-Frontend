<template>
  <div
    id="gpPaginationComponent"
    class="w-full"
  >
    <nav
      class="grid w-full grid-cols-[2.25rem_minmax(0,1fr)_2.25rem] items-center gap-2 sm:gap-4"
      role="navigation"
      aria-label="Paginacion de Grandes Premios"
    >
      <button
        type="button"
        :disabled="!hasPrevious"
        class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-lg font-semibold text-gray-700 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-0 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
        aria-label="Ir al Gran Premio anterior"
        @click="goToAdjacent(false)"
      >
        &laquo;
      </button>

      <span
        class="min-w-0 w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-center text-sm font-semibold text-gray-800 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      >
        <span class="block truncate">{{ props.grandPrix.code }} ({{ props.grandPrix.round }}º)</span>
      </span>

      <button
        type="button"
        :disabled="!hasNext"
        class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-lg font-semibold text-gray-700 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-0 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
        aria-label="Ir al Gran Premio siguiente"
        @click="goToAdjacent(true)"
      >
        &raquo;
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouteLocationRaw, useRouter } from "vue-router";

import { GrandPrix } from "@/types/GrandPrix";
import { Competition } from "@/types/Competition";

interface Props {
  competition: Competition;
  grandPrix: GrandPrix;
  isAdminPag?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isAdminPag: false,
});

const emit = defineEmits<{
  navigate: [payload: { next: boolean; targetGrandPrixId: number }];
}>();

const router = useRouter();

const hasPrevious = computed(() => Boolean(props.grandPrix.previousGrandPrix?.id));
const hasNext = computed(() => Boolean(props.grandPrix.nextGrandPrix?.id));

function goToAdjacent(next: boolean): void {
  const targetGrandPrixId = next
    ? props.grandPrix.nextGrandPrix?.id
    : props.grandPrix.previousGrandPrix?.id;

  if (!targetGrandPrixId) {
    return;
  }

  const params: RouteLocationRaw = {
    name: props.isAdminPag ? "adminGpEditInSeason" : "gpdetails",
    params: {
      competition: props.competition.code,
      season: props.grandPrix.season.name,
      gp: targetGrandPrixId,
    },
  };

  emit("navigate", { next, targetGrandPrixId });
  router.push(params);
}

defineExpose({
  goToAdjacent,
  hasPrevious,
  hasNext,
});
</script>
