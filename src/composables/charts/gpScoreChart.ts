import { barX, defineChart, text } from "@tanstack/charts";
import type { ChartPoint } from "@tanstack/charts";
import { colorLegend } from "@tanstack/charts";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import { truncateLabel } from "@/composables/charts/chartText";

export interface GpScoreRow {
  username: string;
  sessionCode: string;
  sessionName: string;
  points: number;
}

export interface GpScoreChartOptions {
  rows: readonly GpScoreRow[];
  /** Usuarios de mayor a menor puntuación en el GP (de arriba abajo) */
  usernames: readonly string[];
  /** Nombres de sesión en orden cronológico: dominio de color */
  sessionNames: readonly string[];
  totalsByUser: ReadonlyMap<string, number>;
  winners: readonly string[];
  currentUsername: string;
}

const SESSION_PALETTE = ["#8e4aec", "#22c55e", "#f59e0b", "#0ea5e9", "#ec4899", "#14b8a6"];

/** Alto en px: una fila por usuario más ejes y leyenda */
export function gpScoreChartHeight(userCount: number): number {
  return Math.max(200, userCount * 34 + 120);
}

interface TotalRow {
  username: string;
  total: number;
  label: string;
}

export function buildGpScoreChart(options: GpScoreChartOptions) {
  const { rows, usernames, sessionNames, totalsByUser, winners, currentUsername } = options;

  const totals: TotalRow[] = usernames.map((username) => {
    const total = totalsByUser.get(username) ?? 0;
    return { username, total, label: `${total}${winners.includes(username) ? " 🏆" : ""}` };
  });

  return defineChart({
    marks: [
      barX(rows, {
        id: "session-points",
        x: "points",
        y: "username",
        color: "sessionName",
        key: (row) => `${row.username}-${row.sessionCode}`,
        inset: 3,
      }),
      text(totals, {
        id: "totals",
        x: "total",
        y: "username",
        text: "label",
        anchor: "start",
        dx: 6,
        fontWeight: 600,
      }),
    ],
    scales: {
      x: {
        scale: scaleLinear,
        nice: true,
        grid: true,
        axis: { label: "Puntos en el Gran Premio" },
      },
      y: {
        scale: () => scaleBand<string>().domain([...usernames]).padding(0.2),
        axis: {
          ticks: { format: (username) => truncateLabel(username) },
          tickLabels: {
            fontWeight: (context) => (context.value === currentUsername ? 700 : undefined),
          },
        },
      },
    },
    color: {
      domain: [...sessionNames],
      range: sessionNames.map((_, index) => SESSION_PALETTE[index % SESSION_PALETTE.length]!),
      legend: colorLegend({ label: "Sesión", placement: "bottom" }),
    },
    margin: { right: 56 },
    focus: "group-y",
    maxFocusDistance: Number.POSITIVE_INFINITY,
    tooltip: {
      use: tooltip,
      className: "p-chart-tooltip",
      content: (points: readonly ChartPoint[]) => {
        const segments = points
          .map((point) => point.datum as GpScoreRow | TotalRow)
          .filter((datum): datum is GpScoreRow => "sessionName" in datum);
        const username = segments[0]?.username ?? String(points[0]?.yValue ?? "");

        return {
          title: username,
          rows: [
            ...segments.map((segment) => ({
              label: segment.sessionName,
              value: `${segment.points} pts`,
              color: SESSION_PALETTE[sessionNames.indexOf(segment.sessionName) % SESSION_PALETTE.length],
            })),
            { label: "Total", value: `${totalsByUser.get(username) ?? 0} pts` },
          ],
        };
      },
    },
  });
}
