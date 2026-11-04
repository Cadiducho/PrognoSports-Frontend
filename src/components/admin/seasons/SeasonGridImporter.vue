<template>
  <section class="flex flex-col gap-6">
    <PFormGrid :cols="2">
      <PSelect
        v-model="sourceSeasonId"
        label="Copiar desde la temporada"
        placeholder="Selecciona una temporada"
      >
        <option
          v-for="season in sourceSeasons"
          :key="season.id"
          :value="season.id"
        >
          {{ season.name }} · {{ season.competition?.name }}
        </option>
      </PSelect>
    </PFormGrid>

    <Loading v-if="isLoading" />
    <PrognoAlert
      v-else-if="loadError"
      variant="danger"
    >
      {{ loadError }}
    </PrognoAlert>

    <template v-else-if="sourceSeasonId !== ''">
      <section
        v-for="section in sections"
        :key="section.key"
        class="flex flex-col gap-3"
      >
        <header class="flex flex-wrap items-center justify-between gap-2">
          <PTitle
            tag="h3"
            type="header"
            no-margin
          >
            {{ section.title }}
            <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
              {{ selectedCount(section.rows) }} de {{ section.rows.length }} seleccionados
            </span>
          </PTitle>
          <div
            v-if="selectableRows(section.rows).length"
            class="flex gap-1"
          >
            <PButton
              type="ghost"
              color="info"
              size="small"
              @click="setAll(section.rows, true)"
            >
              Todos
            </PButton>
            <PButton
              type="ghost"
              color="info"
              size="small"
              @click="setAll(section.rows, false)"
            >
              Ninguno
            </PButton>
          </div>
        </header>

        <p
          v-if="!section.rows.length"
          class="text-sm text-gray-500 dark:text-gray-400"
        >
          La temporada de origen no tiene {{ section.title.toLowerCase() }}.
        </p>

        <ul
          v-else
          class="grid grid-cols-1 gap-3 lg:grid-cols-2"
        >
          <li
            v-for="row in section.rows"
            :key="row.id"
            class="rounded-lg border p-3 transition"
            :class="rowClass(row)"
          >
            <div class="mb-2 flex items-center justify-between gap-2">
              <label
                class="flex min-w-0 items-center gap-2"
                :class="isSelectable(row) ? 'cursor-pointer' : 'cursor-default'"
              >
                <input
                  type="checkbox"
                  class="h-5 w-5 shrink-0 cursor-pointer rounded-sm border-gray-300 text-brand-600 focus:ring-2 focus:ring-brand-500 disabled:cursor-default dark:border-gray-600 dark:bg-gray-700"
                  :checked="row.selected"
                  :disabled="!isSelectable(row)"
                  @change="onToggle(row, $event)"
                >
                <span
                  class="inline-block h-3 w-3 shrink-0 rounded-full ring-1 ring-black/10 dark:ring-white/20"
                  :style="{backgroundColor: rowColor(row)}"
                />
                <span class="truncate font-semibold text-gray-800 dark:text-gray-100">{{ row.label }}</span>
              </label>
              <span
                class="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold"
                :class="statusClass[row.status]"
              >
                <i
                  v-if="row.status === 'sending'"
                  class="fa fa-spinner fa-spin"
                  aria-hidden="true"
                />
                {{ statusLabel(row) }}
              </span>
            </div>

            <fieldset
              v-if="row.status !== 'existing'"
              :disabled="!row.selected || row.status === 'done' || row.status === 'sending'"
              class="min-w-0"
              :class="row.selected ? '' : 'opacity-50'"
            >
              <ConstructorSeasonFields
                v-if="section.key === 'constructors'"
                :model-value="row.model as ConstructorSeasonModel"
                @update:model-value="row.model = $event"
              />
              <DriverSeasonFields
                v-else
                :model-value="row.model as DriverSeasonModel"
                @update:model-value="row.model = $event"
              />
            </fieldset>

            <p
              v-if="row.status === 'error'"
              class="mt-2 text-sm text-error-700 dark:text-error-400"
            >
              {{ row.error }}
            </p>
          </li>
        </ul>
      </section>

      <div class="flex flex-wrap items-center gap-3">
        <PButton
          color="success"
          icon="fa fa-copy"
          :disabled="!canSubmit"
          @click="submit"
        >
          {{ pendingRows.length === 1 ? 'Copiar 1 elemento' : `Copiar ${pendingRows.length} elementos` }}
        </PButton>
        <span
          v-if="invalidCount"
          class="text-sm text-warning-700 dark:text-warning-400"
        >
          Completa los datos de {{ invalidCount }} {{ invalidCount === 1 ? 'elemento' : 'elementos' }}
        </span>
        <span
          v-if="doneCount"
          class="text-sm text-success-700 dark:text-success-400"
        >
          {{ doneCount }} copiados a {{ targetSeason.name }}
        </span>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import {constructorService, driversService, seasonService} from "@/_services";
import {Season} from "@/types/Season";
import {Driver} from "@/types/Driver";
import {Constructor} from "@/types/Constructor";
import {errorMessage} from "@/composables/errorMessage";
import {
  ConstructorSeasonModel,
  constructorSeasonPayload,
  DriverSeasonModel,
  driverSeasonPayload,
  isConstructorSeasonModelValid,
  isDriverSeasonModelValid
} from "@/components/admin/seasons/seasonLinkModels";
import ConstructorSeasonFields from "@/components/admin/seasons/ConstructorSeasonFields.vue";
import DriverSeasonFields from "@/components/admin/seasons/DriverSeasonFields.vue";
import PFormGrid from "@/components/lib/forms/PFormGrid.vue";
import PSelect from "@/components/lib/forms/PSelect.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PTitle from "@/components/lib/PTitle.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import Loading from "@/components/lib/Loading.vue";

/**
 * Copia a `targetSeason` los pilotos y constructores de otra temporada, con sus datos (dorsal y color; coche,
 * nombre largo y color) editables antes de copiar. Lo que ya está en la temporada de destino no se vuelve a copiar.
 */
type Status = 'idle' | 'sending' | 'done' | 'error' | 'existing';
type SectionKey = 'constructors' | 'drivers';
interface ImportRow {
  id: number;
  label: string;
  model: ConstructorSeasonModel | DriverSeasonModel;
  selected: boolean;
  status: Status;
  error?: string;
}

const props = defineProps<{
  targetSeason: Season;
}>();

const emit = defineEmits<{
  /** Total de elementos copiados hasta ahora */
  imported: [counts: { drivers: number; constructors: number }];
  /** Si se está copiando la parrilla */
  busy: [busy: boolean];
}>();

const seasons = ref<Season[]>([]);
const sourceSeasonId = ref<number | ''>('');
const isLoading = ref(false);
const loadError = ref<string>();
const constructorRows = ref<ImportRow[]>([]);
const driverRows = ref<ImportRow[]>([]);

const sourceSeasons = computed(() => seasons.value
  .filter(season => season.id !== props.targetSeason.id)
  .sort((a, b) => b.id - a.id));

const sections = computed<Array<{ key: SectionKey; title: string; rows: ImportRow[] }>>(() => [
  {key: 'constructors', title: 'Constructores', rows: constructorRows.value},
  {key: 'drivers', title: 'Pilotos', rows: driverRows.value},
]);

const withHash = (color: string | undefined) => !color ? '' : color.startsWith('#') ? color : `#${color}`;

onMounted(async () => {
  try {
    seasons.value = await seasonService.getSeasonList();
  } catch (e) {
    loadError.value = errorMessage(e) ?? "No se han podido cargar las temporadas";
    return;
  }
  // Por defecto, la temporada anterior de la misma competición
  const previous = sourceSeasons.value.find(season =>
    season.competition?.id === props.targetSeason.competition?.id && season.id < props.targetSeason.id);
  sourceSeasonId.value = previous?.id ?? sourceSeasons.value[0]?.id ?? '';
});

watch(sourceSeasonId, async (id) => {
  const source = seasons.value.find(season => season.id === id);
  if (!source) return;

  isLoading.value = true;
  loadError.value = undefined;
  try {
    const [sourceConstructors, sourceDrivers, targetConstructors, targetDrivers] = await Promise.all([
      constructorService.getConstructorsInSeason(source),
      driversService.getDriversInSeason(source),
      constructorService.getConstructorsInSeason(props.targetSeason),
      driversService.getDriversInSeason(props.targetSeason),
    ]);
    const existingConstructors = new Set(targetConstructors.map(c => c.id));
    const existingDrivers = new Set(targetDrivers.map(d => d.id));

    constructorRows.value = sourceConstructors
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(constructor => constructorRow(constructor, existingConstructors.has(constructor.id)));
    driverRows.value = sourceDrivers
      .sort((a, b) => (a.number ?? 0) - (b.number ?? 0))
      .map(driver => driverRow(driver, existingDrivers.has(driver.id)));
  } catch (e) {
    loadError.value = errorMessage(e) ?? "No se han podido cargar los datos de la temporada";
  } finally {
    isLoading.value = false;
  }
});

const constructorRow = (constructor: Constructor, exists: boolean): ImportRow => ({
  id: constructor.id,
  label: constructor.name,
  model: {fullname: constructor.longname ?? '', car: constructor.carname ?? '', teamcolor: withHash(constructor.teamcolor)},
  selected: !exists,
  status: exists ? 'existing' : 'idle',
});

const driverRow = (driver: Driver, exists: boolean): ImportRow => ({
  id: driver.id,
  label: `${driver.firstname} ${driver.lastname}`,
  model: {number: driver.number, color: withHash(driver.color)},
  selected: !exists,
  status: exists ? 'existing' : 'idle',
});

const isSelectable = (row: ImportRow) => row.status === 'idle' || row.status === 'error';
const selectableRows = (rows: ImportRow[]) => rows.filter(isSelectable);
const selectedCount = (rows: ImportRow[]) => rows.filter(row => row.selected && row.status !== 'existing').length;
const setAll = (rows: ImportRow[], selected: boolean) => selectableRows(rows).forEach(row => row.selected = selected);
const onToggle = (row: ImportRow, event: Event) => {
  row.selected = (event.target as HTMLInputElement).checked;
};

const isRowValid = (key: SectionKey, row: ImportRow) => key === 'constructors'
  ? isConstructorSeasonModelValid(row.model as ConstructorSeasonModel)
  : isDriverSeasonModelValid(row.model as DriverSeasonModel);

const pendingRows = computed(() => sections.value.flatMap(section =>
  section.rows.filter(row => row.selected && isSelectable(row)).map(row => ({key: section.key, row}))));
const invalidCount = computed(() => pendingRows.value.filter(({key, row}) => !isRowValid(key, row)).length);
const isSending = computed(() => [...constructorRows.value, ...driverRows.value].some(row => row.status === 'sending'));
const canSubmit = computed(() => !isSending.value && pendingRows.value.length > 0 && invalidCount.value === 0);
const doneCount = computed(() => [...constructorRows.value, ...driverRows.value].filter(row => row.status === 'done').length);

const rowColor = (row: ImportRow) => {
  const color = 'teamcolor' in row.model ? row.model.teamcolor : row.model.color;
  return color || 'transparent';
};

const rowClass = (row: ImportRow) => {
  if (row.status === 'done') return 'border-success-300 dark:border-success-700';
  if (row.status === 'error') return 'border-error-300 dark:border-error-700';
  if (row.selected && row.status !== 'existing') return 'border-brand-300 dark:border-brand-700';
  return 'border-gray-200 dark:border-gray-700';
};

const statusClass: Record<Status, string> = {
  idle: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
  sending: 'bg-info-100 text-info-800 dark:bg-info-900/40 dark:text-info-300',
  done: 'bg-success-100 text-success-800 dark:bg-success-900/40 dark:text-success-300',
  error: 'bg-error-100 text-error-800 dark:bg-error-900/40 dark:text-error-300',
  existing: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
};

const statusLabel = (row: ImportRow) => ({
  idle: row.selected ? 'Se copiará' : 'No se copiará',
  sending: 'Copiando',
  done: 'Copiado',
  error: 'Error',
  existing: 'Ya está',
}[row.status]);

const sendRow = async (key: SectionKey, row: ImportRow) => {
  row.status = 'sending';
  row.error = undefined;
  try {
    if (key === 'constructors') {
      await constructorService.linkConstructorToSeason(props.targetSeason.id,
        constructorSeasonPayload(row.id, row.model as ConstructorSeasonModel));
    } else {
      await driversService.linkDriverToSeason(props.targetSeason,
        driverSeasonPayload(row.id, row.model as DriverSeasonModel));
    }
    row.status = 'done';
  } catch (e) {
    row.status = 'error';
    row.error = errorMessage(e) ?? 'No se ha podido copiar';
  }
};

// Primero los constructores y después los pilotos; dentro de cada grupo, en paralelo
const submit = async () => {
  if (!canSubmit.value) return;
  const pending = pendingRows.value;
  emit('busy', true);
  try {
    for (const key of ['constructors', 'drivers'] as SectionKey[]) {
      await Promise.allSettled(pending.filter(item => item.key === key).map(({row}) => sendRow(key, row)));
    }
    emit('imported', {
      constructors: constructorRows.value.filter(row => row.status === 'done').length,
      drivers: driverRows.value.filter(row => row.status === 'done').length,
    });
  } finally {
    emit('busy', false);
  }
};
</script>
