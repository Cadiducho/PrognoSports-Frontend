/** Colores de las series de la Home. Se eligen para no repetirse entre paneles de una misma pestaña. */
export const HOME_COLORS = {
  me: "#8e4aec",
  leader: "#f59e0b",
  average: "#9ca3af",
  compare: "#0ea5e9",
} as const;

/** Colores de cada sesión en las barras apiladas, por id de sesión, y del resto de puntos del GP (bonus) */
export const SESSION_COLORS: Record<number, string> = {
  1: "#22c55e",
  3: "#14b8a6",
  4: "#ec4899",
  2: "#ef4444",
};

export const BONUS_LABEL = "Bonus";
export const BONUS_COLOR = "#eab308";

/** Alto de las gráficas de la Home (px) */
export const HOME_CHART_HEIGHT = 460;
export const PANEL_GAP = 12;
/** Reparto del alto entre el panel de acumulado (arriba) y el de puntos por sesión (abajo) */
export const TOP_PANEL_GROW = 5;
export const BOTTOM_PANEL_GROW = 4;
export const LABEL_FONT_SIZE = 12;
