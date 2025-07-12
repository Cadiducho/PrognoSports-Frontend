<template>
  <div class="flex items-center mb-2 me-4">
    <input
      v-model="modelValue"
      type="radio"
      :class="radioClasses"
      :value="value"
    >
    <label
      class="block ms-2 pl-1 text-gray-800 dark:text-gray-300"
      :class="labelClasses"
    >
      <slot />
    </label>
  </div>
</template>

<script setup lang="ts" generic="T extends string | number | boolean | object">
import {computed} from 'vue';

const modelValue = defineModel<T>({ required: true });
const props = withDefaults(defineProps<{
  color?: 'primary' | 'secondary' | 'gray' | 'warning' | 'danger';
  size?: 'small' | 'medium' | 'large';
  value: T
}>(), {
    color: 'primary',
    size: 'medium',
    value: undefined
});

const radioClasses = computed(() => ({
    'radio': true, // Estilos base
    [props.color]: true, // Colores tienen el mismo nombre que las clases de css
    'small': props.size === 'small',
    'medium': props.size === 'medium',
    'large': props.size === 'large',
}));
const labelClasses = computed(() => ({
    'text-sm': props.size === 'small',
    'text-base': props.size === 'medium',
    'text-lg': props.size === 'large',
}));

</script>

<style lang="scss" scoped>
.radio {
    @apply border-gray-300 focus:ring-2 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-offset-gray-800;
    &.small {
        @apply w-4 w-4;
    }
    &.medium {
        @apply w-5 h-5;
    }
    &.large {
        @apply w-6 h-6;
    }

    &.primary {
        @apply text-brand-600 accent-brand-500 focus:ring-brand-500 dark:focus:ring-brand-600;
    }
    &.secondary {
        @apply text-blue-600 accent-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600;
    }
    &.gray {
        @apply text-gray-600 accent-gray-500 focus:ring-gray-500 dark:focus:ring-gray-600;
    }
    &.warning {
        @apply text-warning-600 accent-warning-500 focus:ring-warning-500 dark:focus:ring-warning-600;
    }
    &.danger {
        @apply text-errpr-600 accent-error-500 focus:ring-error-500 dark:focus:ring-error-600;
    }
}
</style>
