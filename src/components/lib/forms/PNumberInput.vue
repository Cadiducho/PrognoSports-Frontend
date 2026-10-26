<template>
  <input
    :value="model"
    class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
    type="number"
    :min="min"
    :max="max"
    :step="step"
    @input="updateValue"
    @change="restoreIfEmpty"
  >
</template>

<script setup lang="ts">
const model = defineModel<number>({ required: true });
withDefaults(defineProps<{ min?: number; max?: number; step?: number }>(), { step: 1 });

const updateValue = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!Number.isNaN(input.valueAsNumber)) model.value = input.valueAsNumber;
};

// Si se deja vacío, vuelve a mostrar el valor que realmente tiene el modelo
const restoreIfEmpty = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (Number.isNaN(input.valueAsNumber)) input.value = String(model.value);
};
</script>
