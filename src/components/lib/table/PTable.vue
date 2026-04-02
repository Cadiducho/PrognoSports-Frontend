<template>
  <form
    v-if="withFilter !== undefined"
    class="mb-2"
  >
    <PField>
      <PInput
        v-model="searchInput"
        name="search"
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
          :class="[
            'border-b dark:border-slate-600 font-medium p-2 pl-8 pt-0 pb-3 text-slate-500 dark:text-slate-200 text-left',
            col.sortable ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700' : ''
          ]"
          @click="col.sortable && handleSort(col)"
        >
          <div class="flex items-center gap-2">
            <span>{{ col.label }}</span>
            <span v-if="col.sortable && sortField === col.sortKey" class="text-xs">
              <i v-if="sortDirection === 'ASC'" class="fas fa-arrow-up" />
              <i v-else class="fas fa-arrow-down" />
            </span>
          </div>
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
        :key="props.rowKey ? getRowData(row, props.rowKey) : index"
        :class="[getRowStyle(index), props.rowClass?.(row) || '']"
      >
        <td
          v-for="col in columns"
          :key="col.field"
          :class="getTdStyle()"
          @click="$emit('click', row, col, getRowData(row, col.field))"
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
              <template v-if="typeof col.formatter !== 'function'">
                <component
                  :is="col.formatter"
                  :row="row"
                  :column="col"
                  :value="getRowData(row, col.field)"
                  v-bind="(col as any).formatterProps || {}"
                />
              </template>
              <template v-else>
                {{ col.formatter(getRowData(row, col.field)) }}
              </template>
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
              class="fa fa-eye cursor-pointer p-1 text-brand-accent-500 hover:text-brand-accent-600 dark:text-brand-accent-500 dark:hover:text-brand-accent-600"
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
    :total="sortedAndFilteredRows.length"
    @update:current-page="currentPage = $event"
  />
</template>


<script setup lang="ts" generic="T">
import {computed, ref, watch} from "vue";
import PPagination from "@/components/lib/PPagination.vue";
import {useDayjs} from "@/composables/useDayjs";
import {Column, type SortDirection} from "@/components/lib/table/index";
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
    defaultSortField?: string | ((row: T) => any);
    defaultSortDirection?: SortDirection;
    rowKey?: string;
    rowClass?: (row: T) => string;
}
const props = withDefaults(defineProps<Props<T>>(), {
    withFilter: undefined,
    hasViewButton: false,
    hasEditButton: false,
    hasDeleteButton: false,
    paginated: false,
    perPage: 10,
    striped: true,
    defaultSortDirection: undefined,
    defaultSortField: undefined,
    rowKey: undefined,
    rowClass: undefined
});
defineEmits<{
    view: [element: T],
    edit: [element: T],
    delete: [element: T]
    click: [element: T, column: Column, value: T]
}>();
const dayjs = useDayjs();
const dateDiff = dayjs.dateDiff;
const humanDateTime = dayjs.humanDateTime;
const humanDate = dayjs.humanDate;

const currentPage = ref(1);
const searchInput = ref("");
const sortField = ref<string | ((row: T) => any) | undefined>(props.defaultSortField);
const sortDirection = ref<SortDirection>(props.defaultSortDirection ?? "ASC");

const filteredRows = computed((): Array<T> => {
    if (!props.withFilter) return props.rows;
    if (!searchInput.value.trim()) {
        return props.rows;
    }
    const filterLowerCase = searchInput.value.toLowerCase().trim();
    return props.withFilter(props.rows, filterLowerCase);
});

watch(
  () => props.defaultSortField,
  (newVal) => {
    if (newVal !== undefined) {
      sortField.value = newVal;
    }
  }
);

watch(
  () => props.defaultSortDirection,
  (newVal) => {
    if (newVal !== undefined) {
      sortDirection.value = newVal;
    }
  }
);

const sortedAndFilteredRows = computed((): Array<T> => {
    let result = [...filteredRows.value];

    if (!sortField.value) return result;

    result.sort((a, b) => {
        let aVal = typeof sortField.value === 'function'
            ? sortField.value(a)
            : getRowData(a, sortField.value as string);
        let bVal = typeof sortField.value === 'function'
            ? sortField.value(b)
            : getRowData(b, sortField.value as string);

        // Handle null/undefined
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return sortDirection.value === 'ASC' ? 1 : -1;
        if (bVal == null) return sortDirection.value === 'ASC' ? -1 : 1;

        // Compare values
        if (aVal < bVal) return sortDirection.value === 'ASC' ? -1 : 1;
        if (aVal > bVal) return sortDirection.value === 'ASC' ? 1 : -1;
        return 0;
    });

    return result;
});

const handleSort = (col: Column) => {
    const colSortKey = col.sortKey ?? col.field;

    if (sortField.value === colSortKey) {
        // Toggle direction if clicking same column
        sortDirection.value = sortDirection.value === 'ASC' ? 'DESC' : 'ASC';
    } else {
        // New column, set to ASC
        sortField.value = colSortKey;
        sortDirection.value = 'ASC';
    }
};

const getHeaderStyle = () => {
  return ["border-b", "dark:border-slate-600", "font-medium", "p-2", "pl-8", "pt-0", "pb-3", "text-slate-500", "dark:text-slate-200", "text-left"];
}
const getTdStyle = () => {
  return ["border-b", "dark:border-slate-600", "p-2", "text-slate-700", "dark:text-slate-200"];
}

const getRowStyle = (index: number): string[] => {
    if (props.striped && (index % 2 !== 0)) return ["border-b", "dark:bg-gray-800", "dark:border-gray-700", "hover:bg-slate-200", "hover:dark:bg-slate-700"];
    return ["bg-gray-100", "dark:bg-gray-900", "hover:bg-slate-200", "dark:hover:bg-slate-800"];
}

const getRowData = (row: T, rowName: string): string => {
    if (rowName.includes(".")) {
        const [first, ...rest] = rowName.split(".");
        return getRowData(row[first as keyof T] as T, rest.join(".")) as string;
    }
    return row[rowName as keyof T] as unknown as string;
}

const visibleData = computed(() => {
    if (!props.paginated) return sortedAndFilteredRows.value;

    const current = currentPage.value;
    const perPage = props.perPage;

    if (sortedAndFilteredRows.value.length <= perPage) return sortedAndFilteredRows.value;

    const start = (current - 1) * perPage;
    const end = start + perPage;
    return sortedAndFilteredRows.value.slice(start, end);
});

const hasActions = computed(() => {
    return props.hasViewButton || props.hasEditButton || props.hasDeleteButton;
});

</script>

<style scoped lang="scss">

</style>
