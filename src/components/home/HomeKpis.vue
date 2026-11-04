<script setup lang="ts">
import { computed } from "vue";
import type { HomeKpis } from "@/composables/charts/homeSeason";
import type { UserResume } from "@/types/User";
import PCard from "@/components/lib/PCard.vue";
import PTooltip from "@/components/lib/PTooltip.vue";

const props = defineProps<{
  kpis: HomeKpis;
  /** Desglose por sesión y victorias; null mientras carga o si no hay permisos sobre la comunidad */
  resume: UserResume | null;
}>();

const decimal = (value: number) => value.toLocaleString("es-ES", { maximumFractionDigits: 1 });

/** El resumen llega como objeto plano en las cifras por sesión y como Map en las victorias */
const entriesOf = <T,>(source: Map<string, T> | Record<string, T> | undefined | null): [string, T][] => {
  if (!source) {
    return [];
  }
  return source instanceof Map ? [...source.entries()] : Object.entries(source);
};

/** Un bloque del tooltip: un título opcional y líneas `etiqueta: valor` (o solo el valor) */
interface TooltipSection {
  title?: string;
  lines: { label?: string; value: string }[];
  /** Texto cuando no hay líneas */
  empty?: string;
}

interface Kpi {
  label: string;
  value: string;
  hint: string;
  hintClass: string;
  tooltip: TooltipSection[];
}

const NEUTRAL = "text-gray-600 dark:text-gray-400";
const UP = "text-success-700 dark:text-success-300";
const DOWN = "text-error-700 dark:text-error-300";

const cards = computed<Kpi[]>(() => {
  const { position, points, gapToLeader, average, communityAverage, wins, played } = props.kpis;
  const resume = props.resume;
  const delta = position?.delta ?? null;

  const pointsBySession = entriesOf(resume?.totalPointsBySession).map(([label, value]) => ({ label, value: String(value) }));
  const averageBySession = entriesOf(resume?.averagePointsBySession).map(([label, value]) => ({ label, value: decimal(Number(value)) }));
  const wonSessions = entriesOf(resume?.wonSessions).filter(([, gps]) => gps.length > 0);
  const wonSessionsCount = wonSessions.reduce((sum, [, gps]) => sum + gps.length, 0);
  const wonGps = resume ? resume.wonGrandPrixes ?? [] : null;

  return [
    {
      label: "Puesto",
      value: position ? `${position.standings}º` : "—",
      hint: delta === null ? "Sin cambios que mostrar" : delta > 0 ? `▲ ${delta} desde el último GP` : delta < 0 ? `▼ ${-delta} desde el último GP` : "= sin cambios",
      hintClass: delta === null || delta === 0 ? NEUTRAL : delta > 0 ? UP : DOWN,
      tooltip: [{
        lines: [
          { value: position ? `${position.standings}º en el ranking de esta comunidad` : "Aún no tienes puesto en el ranking" },
          ...(delta === null ? [] : [{
            value: delta > 0
              ? `Has subido ${delta} ${delta === 1 ? "puesto" : "puestos"} respecto al GP anterior`
              : delta < 0
                ? `Has bajado ${-delta} ${delta === -1 ? "puesto" : "puestos"} respecto al GP anterior`
                : "Te mantienes en el mismo puesto que en el GP anterior",
          }]),
        ],
      }],
    },
    {
      label: "Puntos",
      value: points.toLocaleString("es-ES"),
      hint: gapToLeader === 0 ? "Eres el líder" : `a ${gapToLeader.toLocaleString("es-ES")} del líder`,
      hintClass: NEUTRAL,
      tooltip: [{ title: "Puntos por sesión", lines: pointsBySession, empty: "Aún no hay desglose por sesión" }],
    },
    {
      label: "Media por GP",
      value: average === null ? "—" : decimal(average),
      hint: communityAverage === null ? "" : `comunidad: ${decimal(communityAverage)}`,
      hintClass: NEUTRAL,
      tooltip: [
        { title: "Media de puntos por sesión", lines: averageBySession, empty: "Aún no hay desglose por sesión" },
        ...(communityAverage === null ? [] : [{ lines: [{ label: "Media de la comunidad por GP", value: decimal(communityAverage) }] }]),
      ],
    },
    {
      label: "GP ganados",
      value: String(wonGps ? wonGps.length : wins),
      hint: `de ${played} disputados${resume ? ` · ${wonSessionsCount} ${wonSessionsCount === 1 ? "sesión ganada" : "sesiones ganadas"}` : ""}`,
      hintClass: NEUTRAL,
      tooltip: [
        { title: "Grandes Premios ganados", lines: (wonGps ?? []).map((name) => ({ value: name })), empty: "No has ganado Grandes Premios" },
        { title: "Sesiones ganadas", lines: wonSessions.map(([label, gps]) => ({ label, value: gps.join(", ") })), empty: "No has ganado Sesiones" },
      ],
    },
  ];
});
</script>

<template>
  <PCard>
    <div class="grid grid-cols-2 gap-4">
      <PTooltip
        v-for="card in cards"
        :key="card.label"
        class="flex!"
      >
        <!-- Enfocable, para que el tooltip también abra con teclado y al tocar en móvil -->
        <div
          class="flex flex-col rounded-md outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent-500"
          tabindex="0"
        >
          <p class="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
            {{ card.label }}
          </p>
          <p class="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            {{ card.value }}
          </p>
          <p
            class="text-xs font-medium"
            :class="card.hintClass"
          >
            {{ card.hint }}
          </p>
        </div>

        <template #tooltip>
          <div class="flex max-w-64 flex-col gap-2">
            <section
              v-for="(section, index) in card.tooltip"
              :key="index"
            >
              <h3
                v-if="section.title"
                class="text-xs font-semibold uppercase tracking-wide opacity-75"
              >
                {{ section.title }}
              </h3>
              <ul v-if="section.lines.length">
                <li
                  v-for="(line, lineIndex) in section.lines"
                  :key="lineIndex"
                >
                  <template v-if="line.label">
                    <b>{{ line.label }}</b>: {{ line.value }}
                  </template>
                  <template v-else>
                    {{ line.value }}
                  </template>
                </li>
              </ul>
              <p v-else>
                {{ section.empty }}
              </p>
            </section>
          </div>
        </template>
      </PTooltip>
    </div>
  </PCard>
</template>
