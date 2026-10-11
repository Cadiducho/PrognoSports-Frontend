export interface LabelAnchor {
  key: string;
  /** Posición vertical del punto al que acompaña la etiqueta, en píxeles */
  y: number;
}

export interface SpreadOptions {
  /** Distancia vertical mínima entre los centros de dos etiquetas contiguas, en píxeles */
  minGap: number;
  /** Límites en los que debe quedar el centro de cada etiqueta */
  min: number;
  max: number;
}

/**
 * Separa verticalmente etiquetas que se solaparían y devuelve el desplazamiento en píxeles (`dy`) de cada una.
 * Las etiquetas que ya caben no se mueven; las que chocan se reparten alrededor de su centro común, sin salirse de
 * los límites. Si no hay sitio para todas con `minGap`, se reduce el hueco en lugar de sacarlas del gráfico.
 */
export function spreadLabels(anchors: readonly LabelAnchor[], { minGap, min, max }: SpreadOptions): Map<string, number> {
  const offsets = new Map<string, number>();
  if (anchors.length === 0) {
    return offsets;
  }

  const sorted = [...anchors].sort((a, b) => a.y - b.y || a.key.localeCompare(b.key));
  const positions = sorted.map((anchor) => Math.min(max, Math.max(min, anchor.y)));

  // Con muchas etiquetas puede no haber sitio para todas: se acorta el hueco para que sigan dentro
  const gap = sorted.length > 1 ? Math.min(minGap, (max - min) / (sorted.length - 1)) : minGap;

  // Relajación: cada pasada separa a medias los pares que chocan y vuelve a encerrar el conjunto en los límites
  for (let pass = 0; pass < 200; pass++) {
    let moved = false;
    for (let i = 0; i < positions.length - 1; i++) {
      const overlap = gap - (positions[i + 1]! - positions[i]!);
      if (overlap > 0.01) {
        positions[i] = positions[i]! - overlap / 2;
        positions[i + 1] = positions[i + 1]! + overlap / 2;
        moved = true;
      }
    }
    for (let i = 0; i < positions.length; i++) {
      positions[i] = Math.min(max, Math.max(min, positions[i]!));
    }
    if (!moved) {
      break;
    }
  }

  sorted.forEach((anchor, index) => {
    offsets.set(anchor.key, positions[index]! - anchor.y);
  });
  return offsets;
}
