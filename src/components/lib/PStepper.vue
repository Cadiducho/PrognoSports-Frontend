<template>
  <section class="w-full">
    <ol
      class="mb-6 grid gap-2 sm:grid-flow-col sm:auto-cols-fr"
      aria-label="Progreso del formulario"
    >
      <li
        v-for="(step, index) in steps"
        :key="step.label"
      >
        <button
          type="button"
          class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-brand-500"
          :class="index === model ? 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-100' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'"
          :aria-current="index === model ? 'step' : undefined"
          @click="model = index"
        >
          <span
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs"
            :class="index === model ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'"
          >{{ index + 1 }}</span>
          {{ step.label }}
        </button>
      </li>
    </ol>

    <slot :name="`step-${model}`" />
  </section>
</template>

<script setup lang="ts">
export interface StepperStep {
  label: string;
}

const model = defineModel<number>({ required: true });
defineProps<{ steps: StepperStep[] }>();
</script>
