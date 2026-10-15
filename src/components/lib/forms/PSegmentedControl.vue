<script setup lang="ts" generic="T extends string">
import { nextTick, ref } from "vue";

interface SegmentedOption {
  value: T;
  label: string;
}

const selected = defineModel<T>({ required: true });

const props = defineProps<{
  options: SegmentedOption[];
  ariaLabel: string;
}>();

const group = ref<HTMLElement | null>(null);

// Teclado de un radiogroup: las flechas mueven la selección y el foco; solo la opción activa entra con Tab
const onKeydown = (event: KeyboardEvent, index: number): void => {
  const step = ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : ["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : 0;
  if (step === 0) {
    return;
  }
  event.preventDefault();
  const next = (index + step + props.options.length) % props.options.length;
  selected.value = props.options[next]!.value;
  nextTick(() => group.value?.querySelectorAll<HTMLButtonElement>("[role=radio]")[next]?.focus());
};
</script>

<template>
  <div
    ref="group"
    role="radiogroup"
    :aria-label="ariaLabel"
    class="inline-flex max-w-full flex-wrap gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800"
  >
    <button
      v-for="(option, index) in options"
      :key="option.value"
      type="button"
      role="radio"
      class="rounded-md px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
      :class="selected === option.value
        ? 'bg-white text-brand-700 shadow dark:bg-gray-700 dark:text-brand-200'
        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'"
      :aria-checked="selected === option.value"
      :tabindex="selected === option.value ? 0 : -1"
      @click="selected = option.value"
      @keydown="onKeydown($event, index)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
