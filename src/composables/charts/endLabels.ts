import { createChartScene } from "@tanstack/charts";
import { spreadLabels } from "@/composables/charts/labelLayout";

type MeasurableChart = Parameters<typeof createChartScene>[0];

export interface EndLabelAnchor {
  key: string;
  /** Valor en el eje Y del punto al que acompaña la etiqueta */
  value: number;
}

export interface EndLabelOptions {
  /** Alto con el que se renderizará la gráfica (o el panel que contiene el eje Y) */
  height: number;
  fontSize: number;
  /** Ancho solo para medir: el alto del gráfico no depende de él */
  width?: number;
}

/**
 * Desplazamiento vertical (`dy`) de cada etiqueta del final de una línea para que no se solapen.
 * Se hace una pasada de medición de la gráfica sin desplazamientos para saber dónde caería cada una en píxeles.
 */
export function endLabelOffsets(
  measure: MeasurableChart,
  anchors: readonly EndLabelAnchor[],
  { height, fontSize, width = 900 }: EndLabelOptions,
): Map<string, number> {
  if (anchors.length === 0) {
    return new Map();
  }
  const scene = createChartScene(measure, { width, height });
  const yScale = scene.scales.y;
  if (!yScale) {
    return new Map();
  }
  return spreadLabels(
    anchors.map((anchor) => ({ key: anchor.key, y: yScale.map(anchor.value) })),
    {
      minGap: fontSize + 4,
      min: scene.chart.y + fontSize / 2,
      max: scene.chart.y + scene.chart.height - fontSize / 2,
    },
  );
}
