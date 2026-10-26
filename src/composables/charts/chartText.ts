/** Recorta un texto largo con puntos suspensivos para que no desborde ejes ni etiquetas de la gráfica */
export function truncateLabel(label: string, maxLength = 14): string {
  return label.length > maxLength ? `${label.slice(0, maxLength - 1)}…` : label;
}
