export type ColumType = 'text' | 'number' | 'date' | 'datetime' | 'datediff' | 'boolean';

export interface Column {
    label: string;
    field: string;
    type?: ColumType;
    formatter?: (value: any) => string;
}
