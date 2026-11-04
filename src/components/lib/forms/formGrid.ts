/**
 * Columnas que ocupa un campo dentro de un `PFormGrid`. Fuera de una rejilla no tiene efecto.
 * - `2`: dos columnas desde `sm`
 * - `3`: dos columnas desde `sm` y tres desde `lg`
 * - `'full'`: todo el ancho
 */
export type FieldSpan = 2 | 3 | 'full';

// Clases completas y estáticas para que Tailwind las detecte
const SPAN_CLASSES: Record<FieldSpan, string> = {
  2: 'sm:col-span-2',
  3: 'sm:col-span-2 lg:col-span-3',
  full: 'col-span-full',
};

export function fieldSpanClass(span: FieldSpan | undefined): string {
  return span ? SPAN_CLASSES[span] : '';
}
