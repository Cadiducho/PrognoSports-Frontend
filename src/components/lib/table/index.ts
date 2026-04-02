import { Component, Raw } from "vue";

export type ColumType = 'text' | 'number' | 'date' | 'datetime' | 'datediff' | 'boolean';
export type SortDirection = 'ASC' | 'DESC';

export interface Column {
    label: string;
    field: string;
    subtitle?: string;
    visible?: boolean;
    sortable?: boolean;
    sortKey?: string | ((row: any) => any);
    sortFn?: (a: any, b: any) => number;
    type?: ColumType;
    formatter?: ((value: any) => string) | Raw<Component>;
    formatterProps?: Record<string, any>;
}
