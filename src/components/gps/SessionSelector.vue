<template>
  <PCard padding="none">
    <div
      ref="container"
      class="flex w-full gap-1 overflow-x-auto p-1.5"
      role="tablist"
      aria-label="Sesiones del Gran Premio"
    >
      <button
        v-for="session in sessions"
        :key="session.name"
        type="button"
        role="tab"
        :aria-selected="model === session.name"
        class="flex min-w-30 flex-1 flex-col items-center rounded-lg px-4 py-2.5 transition-colors duration-200 motion-reduce:transition-none"
        :class="model === session.name
          ? 'bg-blue-600 text-white shadow dark:bg-blue-500'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'"
        @click="select(session)"
      >
        <span class="text-base font-semibold sm:text-lg">{{ sessionHumanName(session) }}</span>
        <span class="text-xs opacity-70 sm:text-sm">{{ formatDate(session.date, "ddd D · H:mm") }}</span>
      </button>
    </div>
  </PCard>
</template>

<script setup lang="ts">
import {nextTick, ref} from "vue";
import {RaceSession} from "@/types/RaceSession";
import {useDayjs} from "@/composables/useDayjs";
import PCard from "@/components/lib/PCard.vue";
import {sessionHumanName} from "@/utils/raceSession";

defineOptions({name: "SessionSelector"});

const model = defineModel<string>({required: true});

defineProps<{
  sessions: Array<RaceSession>;
}>();

const {formatDate} = useDayjs();
const container = ref<HTMLElement>();

/**
 * Al cambiar de sesión las cards de encima cambian de altura. Se compensa el scroll para que el selector
 * pulsado se quede bajo el cursor en vez de que la página salte
 */
async function select(session: RaceSession): Promise<void> {
  const before = container.value?.getBoundingClientRect().top;
  model.value = session.name;
  await nextTick();
  const after = container.value?.getBoundingClientRect().top;
  if (before !== undefined && after !== undefined && before !== after) {
    window.scrollBy(0, after - before);
  }
}
</script>
