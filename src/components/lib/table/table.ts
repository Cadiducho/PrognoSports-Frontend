type ColumType = 'text' | 'number' | 'date' | 'datetime' | 'datediff' | 'boolean';

interface Column {
    label: string;
    field: string;
    type: ColumType;
}