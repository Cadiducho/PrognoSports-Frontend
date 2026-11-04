/**
 * Validadores compartidos por los formularios del panel de administración.
 */

const HEX_COLOR = /^#?[0-9A-Fa-f]{6}$/;

/** Color hexadecimal de 6 cifras, con o sin `#` */
export function isHexColor(value: unknown): boolean {
  return typeof value === "string" && HEX_COLOR.test(value.trim());
}

/** Texto con contenido (no vacío ni sólo espacios) */
export function isFilled(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

/** Entero mayor o igual que `min` (por defecto 1) */
export function isIntAtLeast(value: unknown, min = 1): boolean {
  return typeof value === "number" && Number.isInteger(value) && value >= min;
}

/** Entero dentro del rango [min, max] */
export function isIntInRange(value: unknown, min: number, max: number): boolean {
  return isIntAtLeast(value, min) && (value as number) <= max;
}

/** Fecha válida */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}
