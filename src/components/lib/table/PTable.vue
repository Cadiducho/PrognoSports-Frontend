<template>
  <form
    v-if="withFilter !== undefined"
    class="mb-2"
  >
    <PField>
      <PInput
        v-model="searchInput"
        placeholder="Buscar"
        type="search"
        icon="fas fa-search"
      />
    </PField>
  </form>

  <table class="table-auto w-full border-collapse">
    <thead class="border-b-2">
      <tr>
        <th
          v-for="col in columns"
          :key="col.field"
          class="border-b dark:border-slate-600 font-medium p-2 pl-8 pt-0 pb-3 text-slate-500 dark:text-slate-200 text-left"
        >
          {{ col.label }}
        </th>
        <td
          v-if="hasActions"
          class="empty"
        />
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(row, index) in visibleData"
        :key="index"
        :class="getRowStyle(index)"
      >
        <td
          v-for="col in columns"
          :key="col.field"
          :class="getTdStyle()"
        >
          <template v-if="col.type === 'boolean'">
            <span
              v-if="getRowData(row, col.field)"
              class="px-3 py-1 text-sm text-white font-semibold rounded-full bg-success-500"
            >Sí</span>
            <span
              v-else
              class="px-3 py-1 text-sm text-white font-semibold rounded-full bg-error-500"
            >No</span>
          </template>
          <template v-else-if="col.type === 'date'">
            {{ humanDate(getRowData(row, col.field) as unknown as Date) }}
          </template>
          <template v-else-if="col.type === 'datetime'">
            {{ humanDateTime(getRowData(row, col.field) as unknown as Date) }}
          </template>
          <template v-else-if="col.type === 'datediff'">
            {{ dateDiff(getRowData(row, col.field) as unknown as Date) }}
          </template>
          <template v-else>
            <template v-if="col.formatter !== undefined">
              {{ col.formatter(getRowData(row, col.field)) }}
            </template>
            <template v-else>
              {{ getRowData(row, col.field) }}
            </template>
          </template>
        </td>
        <td
          v-if="hasActions"
          :class="getTdStyle()"
          class="!text-right"
        >
          <slot
            name="actions"
            :row="row"
            :index="index"
          >
            <i
              v-if="hasViewButton"
              class="fa fa-eye cursor-pointer p-1 text-brand-accent-500 hover:text-brand-accent-600 dark:text-brand-600 dark:hover:bg-brand-700"
              @click="$emit('view', row)"
            />
            <i
              v-if="hasEditButton"
              class="fa fa-pencil cursor-pointer text-warning-500 hover:text-warning-600 p-1"
              @click="$emit('edit', row)"
            />
            <i
              v-if="hasDeleteButton"
              class="fa fa-trash cursor-pointer text-error-600 hover:text-error-700 p-1"
              @click="$emit('delete', row)"
            />
          </slot>
        </td>
      </tr>
    </tbody>
  </table>

  <p-pagination
    v-if="paginated"
    :initial-current="currentPage"
    :per-page="perPage"
    :total="filteredRows.length"
    @update:current-page="currentPage = $event"
  />
</template>


<script setup lang="ts" generic="T">
import {computed, ref} from "vue";
import PPagination from "@/components/lib/PPagination.vue";
import {useDayjs} from "@/composables/useDayjs";
import {Column} from "@/components/lib/table/index";
import PField from "@/components/lib/forms/PField.vue";
import PInput from "@/components/lib/forms/PInput.vue";

interface Props<T> {
    columns: Array<Column>;
    rows: Array<T>;
    withFilter?: (original: Array<T>, filter: string) => Array<T>;
    hasViewButton?: boolean;
    hasEditButton?: boolean;
    hasDeleteButton?: boolean;
    paginated?: boolean;
    perPage?: number;
    striped?: boolean;
}
const props = withDefaults(defineProps<Props<T>>(), {
    withFilter: undefined,
    hasViewButton: false,
    hasEditButton: false,
    hasDeleteButton: false,
    paginated: false,
    perPage: 10,
    striped: true
});
defineEmits<{
    view: [element: T],
    edit: [element: T],
    delete: [element: T]
}>();
const dayjs = useDayjs();
const dateDiff = dayjs.dateDiff;
const humanDateTime = dayjs.humanDateTime;
const humanDate = dayjs.humanDate;

const currentPage = ref(1);
const searchInput = ref("");

const filteredRows = computed((): Array<T> => {
    if (!props.withFilter) return props.rows;
    if (!searchInput.value.trim()) {
        return props.rows;
    }
    const filterLowerCase = searchInput.value.toLowerCase().trim();
    return props.withFilter(props.rows, filterLowerCase);
});

const getHeaderStyle = () => {
    return "border-b dark:border-slate-600 font-medium p-2 pl-8 pt-0 pb-3 text-slate-500 dark:text-slate-200 text-left";
}
const getTdStyle = () => {
    return "border-b dark:border-slate-600 p-2 text-slate-700 dark:text-slate-200";
}

const getRowStyle = (index: number) => {
    if (props.striped && (index % 2 !== 0)) return "border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-slate-200";
    return " bg-gray-100 dark:bg-gray-900 hover:bg-slate-200";
}

const getRowData = (row: T, rowName: string): string => {
    if (rowName.includes(".")) {
        const [first, ...rest] = rowName.split(".");
        return getRowData(row[first as keyof T] as T, rest.join(".")) as string;
    }
    return row[rowName as keyof T] as unknown as string;
}

const visibleData = computed(() => {
    if (!props.paginated) return filteredRows.value;

    const current = currentPage.value;
    const perPage = props.perPage;

    if (props.rows.length <= perPage) return filteredRows.value;

    const start = (current - 1) * perPage;
    const end = start + perPage;
    return filteredRows.value.slice(start, end);
});

const hasActions = computed(() => {
    return props.hasViewButton || props.hasEditButton || props.hasDeleteButton;
});

</script>

<style scoped lang="scss">

</style>
