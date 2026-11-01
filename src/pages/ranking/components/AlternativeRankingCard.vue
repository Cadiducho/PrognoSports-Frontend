<template>
  <section class="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
    <header class="flex items-center gap-2 border-b border-gray-200 px-4 py-3 dark:border-gray-700">
      <span
        class="inline-block size-3 rounded-full"
        :style="{ backgroundColor: ranking.color }"
      />
      <h3 class="font-semibold">
        {{ ranking.title }}
      </h3>
    </header>

    <ol>
      <li
        v-for="row in visibleRows"
        :key="row.user.username"
        class="flex items-center gap-3 px-4 py-2 text-sm"
        :class="isMe(row.user.username) ? 'bg-brand-accent-500 text-white dark:bg-brand-600' : ''"
      >
        <span class="w-5 shrink-0 font-semibold">{{ row.position }}</span>
        <span class="min-w-0 flex-1 truncate">
          <RankingUserCell
            :user="row.user"
            :community-members="communityMembers"
          />
        </span>
        <span
          v-if="row.delta !== 0"
          class="shrink-0 text-xs font-bold"
          :class="deltaClass(row.delta, row.user.username)"
        >
          {{ row.delta > 0 ? "▲" : "▼" }}{{ Math.abs(row.delta) }}
        </span>
        <span class="w-14 shrink-0 text-right font-semibold tabular-nums">{{ row.value }}</span>
      </li>
    </ol>

    <footer
      v-if="ranking.rows.length > TOP_SIZE"
      class="border-t border-gray-200 px-4 py-2 text-center dark:border-gray-700"
    >
      <button
        type="button"
        class="text-sm font-semibold text-brand-600 hover:underline dark:text-brand-300"
        @click="showAll = !showAll"
      >
        {{ showAll ? "Ver menos" : `Ver todos (${ranking.rows.length})` }}
      </button>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { AlternativeRanking } from "@/pages/ranking/types/ranking";
import type { User } from "@/types/User";
import RankingUserCell from "@/pages/ranking/components/RankingUserCell.vue";

const props = defineProps<{
  ranking: AlternativeRanking;
  communityMembers: Map<string, User>;
  currentUsername: string;
}>();

const TOP_SIZE = 8;

const showAll = ref(false);

const isMe = (username: string) => username === props.currentUsername;

// Top 8 y, si el usuario queda fuera, su fila al final
const visibleRows = computed(() => {
  if (showAll.value) {
    return props.ranking.rows;
  }
  const top = props.ranking.rows.slice(0, TOP_SIZE);
  const me = props.ranking.rows.find((row) => isMe(row.user.username));
  return me && !top.includes(me) ? [...top, me] : top;
});

const deltaClass = (delta: number, username: string) => {
  if (isMe(username)) {
    return "text-white";
  }
  return delta > 0 ? "text-success-600 dark:text-success-400" : "text-danger-600 dark:text-danger-400";
};
</script>
