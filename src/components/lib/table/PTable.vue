<template>

    <form v-if="withFilter" class="mb-2">

        <input type="search" id="search" v-model="searchInput"
               class="flex-1 w-full p-3 pl-10 text-sm text-gray-900 dark:placeholder-gray-400 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600"
               placeholder="Buscar">

    </form>

    <table class="table-auto w-full border-collapse">
        <thead class="border-b-2">
        <tr>
            <th v-for="col in columns" class="border-b dark:border-slate-600 font-medium p-2 pl-8 pt-0 pb-3 text-slate-500 dark:text-slate-200 text-left">
                {{ col.label }}
            </th>
            <td v-if="hasActions" class="empty"></td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(row, index) in visibleData" :class="getRowStyle(index)">
            <td v-for="col in columns" :class="getTdStyle()">
                {{ row[col.field] }}
            </td>
            <td v-if="hasActions" :class="getTdStyle()" class="!text-right">
                <slot name="actions" :row="row" :index="index">
                    <button v-if="hasViewButton" class="px-3 py-1 text-sm text-white font-semibold rounded-full bg-blue-500 mr-2" @click="$emit('view', row)">Ver</button>
                    <button v-if="hasEditButton" class="px-3 py-1 text-sm text-black font-semibold rounded-full bg-amber-300 mr-2" @click="$emit('edit', row)">Editar</button>
                    <button v-if="hasDeleteButton" class="px-3 py-1 text-sm text-white font-semibold rounded-full bg-red-500" @click="$emit('delete', row)">Eliminar</button>
                </slot>
            </td>
        </tr>
        </tbody>
    </table>

    <Pagination v-if="paginated" :initial-current="currentPage" :per-page="perPage" :total="filteredRows.length" @update:current-page="currentPage = $event"/>
</template>


<script setup lang="ts" generic="T">
import {computed, ref} from "vue";
import Pagination from "@/components/lib/Pagination.vue";

export interface Props<T> {
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
const props = withDefaults(defineProps<Props<any>>(), {
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
    if (props.striped && (index % 2 !== 0)) return "border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700 hover:bg-slate-50";
    return "bg-white dark:bg-gray-900 hover:bg-slate-50";
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

const sortBy = (column: Column) => {
    console.log("sort by " + column.label);
}

const hasActions = computed(() => {
    return props.hasViewButton || props.hasEditButton || props.hasDeleteButton;
});

</script>

<style scoped lang="scss">

</style>