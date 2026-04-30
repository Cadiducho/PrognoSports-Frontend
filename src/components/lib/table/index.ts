import { Component, Raw } from "vue";

export type ColumType = 'text' | 'number' | 'date' | 'datetime' | 'datediff' | 'boolean';
export type SortDirection = 'ASC' | 'DESC';

export interface Column<T = any> {
    label: string;
    field: string;
    subtitle?: string;
    visible?: boolean;
    sortable?: boolean;
    sortKey?: string | ((row: T) => any);
    sortFn?: (a: T, b: T) => number;
    type?: ColumType;
    /**
     * Function formatter (simple) or component formatter.
     * - function formatter receives (value, row, column) for stronger typing.
     * - component formatter receives props: { row, column, value, ...formatterProps }
     */
    formatter?: ((value: unknown, row: T, column: Column<T>) => string) | Raw<Component>;
    formatterProps?: Record<string, any>;
    /** Optional custom header renderer for the column label */
    headerFormatter?: Raw<Component>;
    headerFormatterProps?: Record<string, any>;
}
