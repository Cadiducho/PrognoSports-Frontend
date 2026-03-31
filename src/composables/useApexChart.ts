import { onMounted, onUnmounted, ref } from "vue";
import { ApexOptions } from "apexcharts";

export interface ApexChartInstance {
  updateOptions: (newOptions: Partial<ApexOptions>) => void;
}

export function isApexChartInstance(value: unknown): value is ApexChartInstance {
  return typeof (value as ApexChartInstance | null)?.updateOptions === "function";
}

interface UseApexChartOptions {
  onMounted?: () => void;
  onUnmounted?: () => void;
}

export function useApexChart(options: UseApexChartOptions = {}) {
  const chartRef = ref<ApexChartInstance | null>(null);

  const updateOptions = (newOptions: Partial<ApexOptions>) => {
    if (!isApexChartInstance(chartRef.value)) {
      return;
    }
    chartRef.value.updateOptions(newOptions);
  };

  const updateTheme = (isDarkMode: boolean, palette: string = "palette8") => {
    updateOptions({
      theme: {
        mode: isDarkMode ? "dark" : "light",
        palette,
      },
    });
  };

  onMounted(() => {
    options.onMounted?.();
  });

  onUnmounted(() => {
    options.onUnmounted?.();
    chartRef.value = null;
  });

  return {
    chartRef,
    updateOptions,
    updateTheme,
  };
}





