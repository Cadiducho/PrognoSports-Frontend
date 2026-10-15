import { createChartScene, defineChart, dot, lineY, ruleY, text } from "@tanstack/charts";
import { d3Curve } from "@tanstack/charts/d3/shape";
import { crosshair } from "@tanstack/charts/crosshair";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import type { ChartPoint } from "@tanstack/charts";
import { curveBumpX } from "d3-shape";
import { gpPointScale, userColorOptions } from "@/composables/charts/chartScales";
import { truncateLabel } from "@/composables/charts/chartText";
import { spreadLabels } from "@/composables/charts/labelLayout";
import type { GrandPrix } from "@/types/GrandPrix";
import type { RankingLinePoint } from "@/pages/ranking/types/ranking";

/** Alto por defecto de las gráficas de líneas del ranking (px). Se usa para medir dónde caen las etiquetas. */
export const LINE_CHART_HEIGHT = 420;

// Ancho con el que se mide la escena para colocar etiquetas: solo importa el alto, que no depende del ancho
const MEASURE_WIDTH = 900;
const LABEL_FONT_SIZE = 13;
const LABEL_MIN_GAP = LABEL_FONT_SIZE + 3;

export interface UserLinesChartOptions {
  rows: readonly RankingLinePoint[];
  grandPrixes: readonly GrandPrix[];
  /** Usuarios ordenados por clasificación: define el dominio de color */
  rankedUsernames: readonly string[];
  /** Usuarios visibles ahora mismo (estado compartido entre pestañas). El resto no se dibuja. */
  visibleUsers: readonly string[];
  /** Usuario logueado, que se dibuja resaltado */
  currentUsername: string;
  yLabel: string;
  /** Alto con el que se renderizará la gráfica (px). Por defecto, LINE_CHART_HEIGHT. */
  height?: number;
  /** Formato del valor en el tooltip y, si no se indica `formatTick`, en el eje */
  formatValue?: (value: number) => string;
  /** Formato de las marcas del eje Y */
  formatTick?: (value: number) => string;
  /** Línea discontinua en y = 0 con este rótulo (vistas de diferencia, donde el 0 es el líder o tú) */
  referenceLine?: { label: string };
  /** Nombre del usuario al final de cada línea. Por defecto, solo en la clasificación. */
  endLabels?: boolean;
  /** Clasificación (bump chart): curvas suaves entre posiciones, eje invertido (1º arriba), puntos grandes y nombre al final de cada línea */
  standings?: boolean;
}

const identityKey = (row: RankingLinePoint) => `${row.username}-${row.gpCode}`;

/** Último punto con valor de cada usuario, para etiquetar el final de su línea */
function lastPointPerUser(rows: readonly RankingLinePoint[]): RankingLinePoint[] {
  const last = new Map<string, RankingLinePoint>();
  for (const row of rows) {
    if (row.value !== null) {
      last.set(row.username, row);
    }
  }
  return [...last.values()];
}

/** Etiquetas del final de cada línea: nombre del usuario en su último punto con valor */
function endLabelRows(options: UserLinesChartOptions): RankingLinePoint[] {
  const visible = new Set(options.visibleUsers);
  return lastPointPerUser(options.rows.filter((row) => visible.has(row.username)));
}

function createUserLinesChart(options: UserLinesChartOptions, labelOffsets?: ReadonlyMap<string, number>) {
  const { rows, grandPrixes, rankedUsernames, visibleUsers, currentUsername } = options;
  const formatValue = options.formatValue ?? ((value: number) => value.toLocaleString("es-ES"));

  const visible = new Set(visibleUsers);
  const shown = rows.filter((row) => visible.has(row.username));
  const others = shown.filter((row) => row.username !== currentUsername);
  const mine = shown.filter((row) => row.username === currentUsername);
  const hasMine = mine.length > 0;

  const maxStanding = options.standings
    ? Math.max(1, ...rows.map((row) => row.value ?? 0))
    : 0;

  const yScale = options.standings
    ? {
      // Holgura de medio puesto para que el 1º y el último no queden pegados a los bordes
      scale: scaleLinear().domain([0.5, maxStanding + 0.5]),
      reverse: true,
      grid: true,
      axis: {
        label: options.yLabel,
        ticks: {
          values: Array.from({ length: maxStanding }, (_, index) => index + 1),
          format: (value: number) => `${value}º`,
        },
      },
    }
    : {
      scale: scaleLinear,
      nice: true,
      grid: true,
      axis: {
        label: options.yLabel,
        ...(options.formatTick ? { ticks: { format: options.formatTick } } : {}),
      },
    };

  const showEndLabels = options.endLabels ?? options.standings ?? false;

  const bumpCurve = options.standings ? d3Curve(curveBumpX) : undefined;

  const marks = [
    lineY(others, {
      id: "others",
      x: "gpCode",
      y: (row) => row.value,
      color: "username",
      key: identityKey,
      points: !options.standings,
      curve: bumpCurve,
      strokeWidth: options.standings ? 2.5 : 2,
      strokeOpacity: hasMine ? 0.6 : 1,
    }),
    lineY(mine, {
      id: "me",
      x: "gpCode",
      y: (row) => row.value,
      color: "username",
      key: identityKey,
      points: !options.standings,
      curve: bumpCurve,
      strokeWidth: options.standings ? 4 : 3.5,
    }),
    crosshair({ x: { label: false }, y: false }),
  ];

  if (options.standings) {
    // Un punto por posición alcanzada. Los GPs sin dato no dibujan punto.
    const dotRows = (list: readonly RankingLinePoint[]) => list.filter((row) => row.value !== null);
    marks.push(
      dot(dotRows(others), {
        id: "others-dots",
        x: "gpCode",
        y: (row) => row.value,
        color: "username",
        key: identityKey,
        r: 4.5,
        fillOpacity: hasMine ? 0.75 : 1,
      }),
      dot(dotRows(mine), {
        id: "me-dots",
        x: "gpCode",
        y: (row) => row.value,
        color: "username",
        key: identityKey,
        r: 6.5,
      }),
    );
  }

  if (showEndLabels) {
    marks.push(
      text(lastPointPerUser(shown), {
        id: "labels",
        key: (row) => row.username,
        x: "gpCode",
        y: (row) => row.value,
        text: (row) => truncateLabel(row.username, 12),
        color: "username",
        anchor: "start",
        dx: 10,
        dy: (row) => labelOffsets?.get(row.username) ?? 0,
        fontSize: LABEL_FONT_SIZE,
        fontWeight: 600,
      }),
    );
  }

  if (options.referenceLine && grandPrixes.length > 0) {
    // Se dibuja primero para quedar por debajo de las líneas. El rótulo va sobre el primer GP.
    const label: RankingLinePoint = { gpCode: grandPrixes[0]!.code, gpName: "", username: "", value: 0 };
    marks.unshift(
      ruleY([0], { id: "reference", strokeOpacity: 0.6, strokeDasharray: "5 4" }),
      text([label], {
        id: "reference-label",
        x: "gpCode",
        y: () => 0,
        text: () => options.referenceLine!.label,
        fill: "currentColor",
        anchor: "start",
        dx: 4,
        dy: -9,
        fontSize: 12,
        fontWeight: 600,
      }),
    );
  }

  const gpNames = new Map(grandPrixes.map((gp) => [gp.code, gp.name]));

  // Si el valor es una diferencia, se muestra también el total original entre paréntesis
  const rowValue = (point: ChartPoint): string => {
    if (options.standings) {
      return `${point.yValue}º`;
    }
    const value = formatValue(Number(point.yValue));
    const total = (point.datum as RankingLinePoint).total;
    return typeof total === "number" ? `${value} (${total.toLocaleString("es-ES")})` : value;
  };

  return defineChart({
    marks,
    // Hueco a la derecha para los nombres que etiquetan el final de cada línea
    margin: showEndLabels ? { right: 104 } : undefined,
    scales: {
      x: {
        scale: gpPointScale(grandPrixes),
        axis: { label: "Grandes Premios" },
      },
      y: yScale,
    },
    // Dominio fijo por clasificación: cada usuario conserva su color aunque se oculten otros
    color: userColorOptions(rankedUsernames),
    focus: "group-x",
    maxFocusDistance: Number.POSITIVE_INFINITY,
    tooltip: {
      use: tooltip,
      className: "p-chart-tooltip",
      anchor: "group-center",
      placement: ["top", "right", "left", "bottom"],
      content: (points: readonly ChartPoint[], context) => {
        // En un mismo GP pueden coincidir la línea, el punto y la etiqueta de un usuario: una fila por usuario
        const byUser = new Map<string, ChartPoint>();
        for (const point of points) {
          const username = (point.datum as RankingLinePoint).username;
          // El rótulo de la línea de referencia también emite un punto, pero no pertenece a ningún usuario
          if (username && typeof point.yValue === "number" && !byUser.has(username)) {
            byUser.set(username, point);
          }
        }
        const primaryUsername = (context.primaryPoint?.datum as RankingLinePoint | undefined)?.username;
        const sorted = [...byUser.entries()].sort(([, a], [, b]) => options.standings
          ? Number(a.yValue) - Number(b.yValue)
          : Number(b.yValue) - Number(a.yValue));
        const gpCode = String(sorted[0]?.[1].xValue ?? "");

        return {
          title: gpNames.get(gpCode) ?? gpCode,
          rows: sorted.map(([username, point]) => ({
            label: username,
            value: rowValue(point),
            color: point.color,
            active: username === primaryUsername,
          })),
        };
      },
    },
  });
}

/**
 * Gráfica de líneas por usuario. Si lleva etiquetas al final de cada línea, se hace una primera pasada para medir
 * dónde caería cada una y una segunda con las que chocan ya separadas, de modo que los nombres siempre se lean.
 */
export function buildUserLinesChart(options: UserLinesChartOptions) {
  const chart = createUserLinesChart(options);
  const showEndLabels = options.endLabels ?? options.standings ?? false;
  if (!showEndLabels) {
    return chart;
  }

  const scene = createChartScene(chart, { width: MEASURE_WIDTH, height: options.height ?? LINE_CHART_HEIGHT });
  const yScale = scene.scales.y;
  if (!yScale) {
    return chart;
  }

  const anchors = endLabelRows(options).map((row) => ({ key: row.username, y: yScale.map(row.value) }));
  const half = LABEL_FONT_SIZE / 2;
  const offsets = spreadLabels(anchors, {
    minGap: LABEL_MIN_GAP,
    min: scene.chart.y + half,
    max: scene.chart.y + scene.chart.height - half,
  });

  return createUserLinesChart(options, offsets);
}
