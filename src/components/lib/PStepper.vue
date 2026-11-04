<template>
  <section class="w-full">
    <ol
      class="mb-8 flex items-start"
      aria-label="Progreso del formulario"
    >
      <li
        v-for="(step, index) in steps"
        :key="step.label"
        class="flex min-w-0 items-start"
        :class="index < steps.length - 1 ? 'flex-1' : 'shrink-0'"
      >
        <button
          type="button"
          class="flex shrink-0 items-start gap-3 rounded-md text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
          :class="step.disabled && index !== model ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'"
          :aria-current="index === model ? 'step' : undefined"
          :aria-label="step.label"
          :disabled="step.disabled && index !== model"
          @click="model = index"
        >
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition"
            :class="circleClass(step, index)"
          >
            <i
              v-if="step.completed && index !== model"
              class="fa fa-check"
              aria-hidden="true"
            />
            <template v-else>{{ index + 1 }}</template>
          </span>
          <!-- En móvil sólo se ve la etiqueta del paso activo -->
          <span
            class="pt-1.5 pr-1"
            :class="index === model ? 'block' : 'hidden sm:block'"
          >
            <span
              class="block whitespace-nowrap text-sm leading-5"
              :class="labelClass(step, index)"
            >{{ step.label }}</span>
            <span
              v-if="step.description"
              class="hidden text-xs leading-4 text-gray-500 lg:block dark:text-gray-400"
            >{{ step.description }}</span>
          </span>
        </button>

        <span
          v-if="index < steps.length - 1"
          class="mx-3 mt-4 h-0.5 min-w-4 flex-1 rounded-full transition-colors"
          :class="step.completed ? 'bg-brand-500 dark:bg-brand-400' : 'bg-gray-200 dark:bg-gray-700'"
          aria-hidden="true"
        />
      </li>
    </ol>

    <template v-if="keepMounted">
      <template
        v-for="(_, index) in steps"
        :key="index"
      >
        <div
          v-if="visited.has(index)"
          v-show="index === model"
        >
          <slot :name="`step-${index}`" />
        </div>
      </template>
    </template>
    <slot
      v-else
      :name="`step-${model}`"
    />
  </section>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";

export interface StepperStep {
  label: string;
  /** Texto secundario bajo la etiqueta */
  description?: string;
  /** Muestra el paso como completado (check) */
  completed?: boolean;
  /** Impide navegar a este paso desde la cabecera */
  disabled?: boolean;
}

const model = defineModel<number>({ required: true });
defineProps<{
  steps: StepperStep[];
  /**
   * Mantiene montados los pasos ya visitados (ocultos con v-show) para que no pierdan su estado ni
   * sus peticiones en curso al cambiar de paso. Cada paso se monta la primera vez que se visita.
   */
  keepMounted?: boolean;
}>();

const visited = ref(new Set<number>());
watch(model, index => {
  if (!visited.value.has(index)) visited.value = new Set(visited.value).add(index);
}, {immediate: true});

const circleClass = (step: StepperStep, index: number): string => {
  if (index === model.value) {
    return 'bg-brand-600 text-white ring-4 ring-brand-100 dark:bg-brand-500 dark:ring-brand-900/60';
  }
  if (step.completed) {
    return 'bg-success-500 text-white dark:bg-success-600';
  }
  return 'border-2 border-gray-300 bg-white text-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-400';
};

const labelClass = (step: StepperStep, index: number): string => {
  if (index === model.value) return 'font-semibold text-brand-700 dark:text-brand-200';
  if (step.completed) return 'font-medium text-gray-800 dark:text-gray-200';
  return 'font-medium text-gray-500 dark:text-gray-400';
};
</script>
