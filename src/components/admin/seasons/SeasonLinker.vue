<template>
  <section class="flex flex-col gap-4">
    <Loading v-if="isLoading" />
    <PrognoAlert
      v-else-if="loadError"
      variant="danger"
    >
      {{ loadError }}
    </PrognoAlert>

    <template v-else>
      <!-- Selector de temporadas, agrupadas por competición -->
      <div
        v-for="group in groupedSeasons"
        :key="group.name"
      >
        <p class="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          {{ group.name }}
        </p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="season in group.seasons"
            :key="season.id"
            type="button"
            class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            :class="chipClass(season)"
            :disabled="isLinked(season)"
            :aria-pressed="isSelected(season)"
            :title="isLinked(season) ? 'Ya enlazada' : undefined"
            @click="toggle(season)"
          >
            <i
              v-if="isLinked(season)"
              class="fa fa-check"
              aria-hidden="true"
            />
            <i
              v-else-if="isSelected(season)"
              class="fa fa-minus"
              aria-hidden="true"
            />
            <i
              v-else
              class="fa fa-plus"
              aria-hidden="true"
            />
            {{ season.name }}
          </button>
        </div>
      </div>

      <p
        v-if="!groupedSeasons.length"
        class="text-sm text-gray-500 dark:text-gray-400"
      >
        No hay temporadas creadas.
      </p>

      <!-- Una tarjeta por temporada seleccionada -->
      <div
        v-if="entries.length"
        class="grid grid-cols-1 gap-4 lg:grid-cols-2"
      >
        <PCard
          v-for="entry in entries"
          :key="entry.season.id"
          padding="sm"
          :class="entry.status === 'done' ? 'ring-2! ring-success-500!' : entry.status === 'error' ? 'ring-2! ring-error-500!' : ''"
        >
          <template #header>
            <div class="flex items-center justify-between gap-2">
              <span class="min-w-0 truncate">
                {{ entry.season.name }}
                <span class="text-sm font-normal text-gray-500 dark:text-gray-400">· {{ entry.season.competition?.name }}</span>
              </span>
              <span class="flex shrink-0 items-center gap-2">
                <span
                  class="rounded-full px-2 py-0.5 text-xs font-semibold"
                  :class="statusClass[entry.status]"
                >
                  <i
                    v-if="entry.status === 'sending'"
                    class="fa fa-spinner fa-spin"
                    aria-hidden="true"
                  />
                  {{ statusLabel(entry) }}
                </span>
                <button
                  v-if="entry.status !== 'done' && entry.status !== 'sending'"
                  type="button"
                  class="cursor-pointer rounded-sm px-1 text-gray-500 hover:text-error-600 dark:text-gray-400 dark:hover:text-error-400"
                  :aria-label="`Quitar ${entry.season.name}`"
                  @click="remove(entry.season)"
                >
                  <i
                    class="fa fa-xmark"
                    aria-hidden="true"
                  />
                </button>
              </span>
            </div>
          </template>

          <fieldset
            :disabled="entry.status === 'done' || entry.status === 'sending'"
            class="min-w-0"
          >
            <slot
              name="fields"
              :season="entry.season"
              :model="entry.model"
              :update="(model: T) => entry.model = model"
            />
          </fieldset>

          <PrognoAlert
            v-if="entry.status === 'error'"
            variant="danger"
            class="mt-3"
          >
            {{ entry.error }}
          </PrognoAlert>
          <div
            v-if="entry.status === 'done' && $slots.done"
            class="mt-3"
          >
            <slot
              name="done"
              :season="entry.season"
              :result="entry.result"
            />
          </div>
        </PCard>
      </div>

      <div
        v-if="pendingEntries.length"
        class="flex flex-wrap items-center gap-3"
      >
        <PButton
          :disabled="!canSubmit"
          color="success"
          icon="fa fa-link"
          @click="submitAll"
        >
          {{ submitText }}
        </PButton>
        <span
          v-if="invalidCount"
          class="text-sm text-warning-700 dark:text-warning-400"
        >
          Completa los datos de {{ invalidCount }} {{ invalidCount === 1 ? 'temporada' : 'temporadas' }}
        </span>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts" generic="T extends object">
import {computed, ref, Ref, watch} from "vue";
import {useQuery} from "@pinia/colada";
import {seasonListQuery} from "@/queries/seasons";
import {Season} from "@/types/Season";
import {errorMessage} from "@/composables/errorMessage";
import PCard from "@/components/lib/PCard.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import Loading from "@/components/lib/Loading.vue";

/**
 * Enlaza una entidad (piloto, constructor, GP...) a una o varias temporadas. Se eligen las temporadas
 * como chips y cada una genera una tarjeta con sus campos (slot `fields`). "Enlazar" envía todas en
 * paralelo y cada tarjeta muestra su propio resultado, con posibilidad de reintentar las que fallen.
 */
type Status = 'idle' | 'sending' | 'done' | 'error';
interface Entry {
  season: Season;
  model: T;
  status: Status;
  error?: string;
  result?: unknown;
}

const props = withDefaults(defineProps<{
  /** Temporadas a las que la entidad ya está enlazada */
  linkedSeasonIds?: number[];
  /** Datos iniciales del formulario de una temporada */
  createModel: (season: Season) => T;
  isValid: (model: T, season: Season) => boolean;
  /** Envía el enlace al servidor. Si lanza, la tarjeta muestra el error */
  submit: (season: Season, model: T) => Promise<unknown>;
  /** Texto del botón, recibe el número de temporadas pendientes */
  submitLabel?: (count: number) => string;
}>(), {
  linkedSeasonIds: () => [],
  submitLabel: undefined,
});

const emit = defineEmits<{
  linked: [season: Season, result: unknown];
  /** Número de temporadas seleccionadas que aún no se han enlazado */
  pending: [count: number];
  /** Si hay enlaces enviándose */
  busy: [busy: boolean];
}>();

defineSlots<{
  fields(props: { season: Season; model: T; update: (model: T) => void }): unknown;
  done?(props: { season: Season; result: unknown }): unknown;
}>();

// La lista de temporadas sale de la caché de consultas
const {data: seasonData, isPending: isLoading, error: seasonsError} = useQuery(seasonListQuery);
const seasons = computed<Season[]>(() => seasonData.value ?? []);
const loadError = computed(() => seasonsError.value
  ? errorMessage(seasonsError.value) ?? "No se han podido cargar las temporadas"
  : undefined);
const entries = ref([]) as Ref<Entry[]>;

const groupedSeasons = computed(() => {
  const groups = new Map<string, Season[]>();
  [...seasons.value]
    .sort((a, b) => b.id - a.id)
    .forEach(season => {
      const name = season.competition?.fullname || season.competition?.name || 'Sin competición';
      groups.set(name, [...(groups.get(name) ?? []), season]);
    });
  return [...groups.entries()].map(([name, list]) => ({name, seasons: list}));
});

const findEntry = (season: Season) => entries.value.find(entry => entry.season.id === season.id);
const isLinked = (season: Season) => props.linkedSeasonIds.includes(season.id) || findEntry(season)?.status === 'done';
const isSelected = (season: Season) => !!findEntry(season);

const chipClass = (season: Season) => {
  if (isLinked(season)) {
    return 'cursor-default border-success-300 bg-success-50 text-success-800 dark:border-success-700 dark:bg-success-900/30 dark:text-success-300';
  }
  if (isSelected(season)) {
    return 'cursor-pointer border-brand-500 bg-brand-100 text-brand-800 dark:border-brand-400 dark:bg-brand-900/40 dark:text-brand-100';
  }
  return 'cursor-pointer border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700';
};

const toggle = (season: Season) => {
  const entry = findEntry(season);
  if (entry) {
    remove(season);
  } else {
    entries.value.push({season, model: props.createModel(season), status: 'idle'});
  }
};

const remove = (season: Season) => {
  const entry = findEntry(season);
  if (!entry || entry.status === 'done' || entry.status === 'sending') return;
  entries.value = entries.value.filter(e => e !== entry);
};

const pendingEntries = computed(() => entries.value.filter(entry => entry.status !== 'done'));
const invalidCount = computed(() => pendingEntries.value.filter(entry => !props.isValid(entry.model, entry.season)).length);
const isSending = computed(() => entries.value.some(entry => entry.status === 'sending'));
const canSubmit = computed(() => !isSending.value && pendingEntries.value.length > 0 && invalidCount.value === 0);

watch(() => pendingEntries.value.length, count => emit('pending', count), {immediate: true});
watch(isSending, sending => emit('busy', sending));

const submitText = computed(() => {
  const count = pendingEntries.value.length;
  if (props.submitLabel) return props.submitLabel(count);
  return count === 1 ? 'Enlazar 1 temporada' : `Enlazar ${count} temporadas`;
});

const statusClass: Record<Status, string> = {
  idle: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
  sending: 'bg-info-100 text-info-800 dark:bg-info-900/40 dark:text-info-300',
  done: 'bg-success-100 text-success-800 dark:bg-success-900/40 dark:text-success-300',
  error: 'bg-error-100 text-error-800 dark:bg-error-900/40 dark:text-error-300',
};

const statusLabel = (entry: Entry) => ({
  idle: props.isValid(entry.model, entry.season) ? 'Listo' : 'Incompleto',
  sending: 'Enviando',
  done: 'Enlazada',
  error: 'Error',
}[entry.status]);

const submitOne = async (entry: Entry) => {
  entry.status = 'sending';
  entry.error = undefined;
  try {
    entry.result = await props.submit(entry.season, entry.model);
    entry.status = 'done';
    emit('linked', entry.season, entry.result);
  } catch (e) {
    entry.status = 'error';
    entry.error = errorMessage(e) ?? 'No se ha podido enlazar';
  }
};

const submitAll = async () => {
  if (!canSubmit.value) return;
  await Promise.allSettled(pendingEntries.value.map(submitOne));
};
</script>
