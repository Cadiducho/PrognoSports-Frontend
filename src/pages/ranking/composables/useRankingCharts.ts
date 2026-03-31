import { computed, watch, type Ref } from "vue";
import { useApexChart } from "@/composables/useApexChart";
import { GrandPrix } from "@/types/GrandPrix";
import { RankingChartOptions, RankingHeatmapPoint } from "@/pages/ranking/types/ranking";

interface ApexFormatterContext {
  dataPointIndex?: number;
  seriesIndex?: number;
  w?: {
    globals?: {
      initialSeries?: Array<{ data?: RankingHeatmapPoint[] }>;
    };
    config?: {
      series?: Array<{ data?: RankingHeatmapPoint[] }>;
    };
  };
}

function getHeatmapDataPoint(ctx: ApexFormatterContext): RankingHeatmapPoint | undefined {
  const seriesIndex = ctx.seriesIndex ?? -1;
  const dataPointIndex = ctx.dataPointIndex ?? -1;

  return ctx.w?.globals?.initialSeries?.[seriesIndex]?.data?.[dataPointIndex]
    ?? ctx.w?.config?.series?.[seriesIndex]?.data?.[dataPointIndex];
}

export function useRankingCharts(darkMode: Ref<boolean>, grandPrixesForTooltip: Ref<GrandPrix[]>) {
  const apexFontFamily = "Inter, sans-serif";
  const heatmapLabelColor = "#111827";

  const { chartRef: gpPointsChartRef, updateTheme: updateGpPointsTheme, updateOptions: updateGpPointsOptions } = useApexChart();
  const { chartRef: accumulatedPointsChartRef, updateTheme: updateAccumulatedTheme, updateOptions: updateAccumulatedOptions } = useApexChart();
  const { chartRef: hitsHeatmapChartRef, updateTheme: updateHitsTheme, updateOptions: updateHitsOptions } = useApexChart();
  const { chartRef: standingsChartRef, updateTheme: updateStandingsTheme, updateOptions: updateStandingsOptions } = useApexChart();

  const gpCodes = computed<string[]>(() => grandPrixesForTooltip.value.map((gp) => gp.code));

  const baseLineChartOptions = computed<RankingChartOptions>(() => ({
    chart: {
      fontFamily: apexFontFamily,
      shadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 1,
      },
      zoom: {
        type: "xy",
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: "zoom",
      },
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    markers: {
      size: 5,
    },
    xaxis: {
      categories: [...gpCodes.value],
      title: {
        text: "Grandes Premios",
      },
    },
    yaxis: {
      title: {
        text: "Puntos",
      },
    },
    legend: {
      position: "top",
      floating: true,
    },
    tooltip: {
      shared: false,
      intersect: true,
      x: {
        formatter: (value: string, opts: ApexFormatterContext) => {
          const gp = grandPrixesForTooltip.value[opts.dataPointIndex ?? -1];
          return gp?.name ?? value;
        },
      },
    },
    theme: {
      mode: darkMode.value ? "dark" : "light",
      palette: "palette8",
    },
  }));

  const standingsChartOptions = computed<RankingChartOptions>(() => ({
    ...baseLineChartOptions.value,
    yaxis: {
      reversed: true,
      title: {
        text: "Posicion",
      },
      min: 1,
      tickAmount: 1,
      labels: {
        formatter: (val: number) => `${val.toFixed(0)}o`,
      },
    },
  }));

  const hitsHeatmapOptions = computed<RankingChartOptions>(() => ({
    chart: {
      type: "heatmap",
      fontFamily: apexFontFamily,
      toolbar: {
        show: true,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: [heatmapLabelColor],
        fontFamily: apexFontFamily,
      },
      formatter: (_val: number, opts: ApexFormatterContext) => {
        const dataPoint = getHeatmapDataPoint(opts);
        return dataPoint?.hits ?? 0;
      },
    },
    xaxis: {
      type: "category",
      categories: [...gpCodes.value],
      title: {
        text: "Grandes Premios",
      },
    },
    yaxis: {
      title: {
        text: "Usuarios",
      },
    },
    plotOptions: {
      heatmap: {
        colorScale: {
          ranges: [
            { from: 0, to: 0, color: "#808080", name: "Sin datos" },
            { from: 0.01, to: 33, color: "#ff9f6b", name: "Bajo" },
            { from: 33.01, to: 66, color: "#efd800", name: "Medio" },
            { from: 66.01, to: 99, color: "#44d63c", name: "Alto" },
            { from: 99.01, to: 100, color: "#ae29d0", name: "Maximo" },
          ],
        },
      },
    },
    tooltip: {
      y: {
        formatter: (_val: number, opts: ApexFormatterContext) => {
          const dataPoint = getHeatmapDataPoint(opts);
          return `${dataPoint?.hits ?? 0} aciertos`;
        },
      },
    },
    theme: {
      mode: darkMode.value ? "dark" : "light",
      palette: "palette8",
    },
  }));

  watch(
    [darkMode, gpCodes],
    () => {
      const categories = [...gpCodes.value];
      updateGpPointsOptions({ xaxis: { categories } });
      updateAccumulatedOptions({ xaxis: { categories } });
      updateStandingsOptions({ xaxis: { categories } });
      updateHitsOptions({ xaxis: { categories } });

      updateGpPointsTheme(darkMode.value);
      updateAccumulatedTheme(darkMode.value);
      updateStandingsTheme(darkMode.value);
      updateHitsTheme(darkMode.value);
    },
    { immediate: true }
  );

  return {
    gpPointsChartRef,
    accumulatedPointsChartRef,
    hitsHeatmapChartRef,
    standingsChartRef,
    gpPointsChartOptions: baseLineChartOptions,
    accumulatedPointsChartOptions: baseLineChartOptions,
    standingsChartOptions,
    hitsHeatmapOptions,
  };
}
