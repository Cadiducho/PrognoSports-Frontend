<template>
  <div>
    <div class="flex gap-2">
      <PInput
        :model-value="displayValue"
        type="text"
        placeholder="#RRGGBB"
        pattern="^#?[0-9A-Fa-f]{6}$"
        :required="required"
        @input="onInputChange"
      />
      <input
        v-model="pickerValue"
        type="color"
        class="w-16 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
        @input="onPickerChange"
      >
    </div>
    <div
      v-if="showPreview"
      class="mt-2 flex items-center gap-2"
    >
      <div
        class="w-12 h-12 rounded border border-gray-300 dark:border-gray-600 shadow-sm"
        :style="{ backgroundColor: previewColor }"
      />
      <span class="text-sm text-gray-600 dark:text-gray-400">Vista previa</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import PInput from "@/components/lib/forms/PInput.vue";
import { ref, computed, watch } from "vue";

interface Props {
  modelValue: string;
  required?: boolean;
  showPreview?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  showPreview: true
});

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>();

const pickerValue = ref('');

// Inicializar el valor del picker
watch(() => props.modelValue, (newValue) => {
  const normalizedValue = newValue.startsWith('#') ? newValue : `#${newValue}`;
  pickerValue.value = normalizedValue;
}, { immediate: true });

const displayValue = computed(() => {
  return props.modelValue.startsWith('#') ? props.modelValue : `#${props.modelValue}`;
});

const previewColor = computed(() => {
  const color = props.modelValue;
  if (!color) return '#000000';
  return color.startsWith('#') ? color : `#${color}`;
});

const onInputChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.trim();

  // Asegurar que siempre tenga #
  if (!value.startsWith('#')) {
    value = `#${value}`;
  }

  emit('update:modelValue', value);
  pickerValue.value = value;
};

const onPickerChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const value = input.value; // Ya incluye el #
  emit('update:modelValue', value);
};
</script>


