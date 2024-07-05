<template>
    <div class="flex items-center mb-2 me-4">
        <input type="radio"
               v-model="modelValue"
               :class="radioClasses"
               :value="value"
        >
        <label class="block ms-2 pl-1 text-gray-800 dark:text-gray-300" :class="labelClasses">
            <slot></slot>
        </label>
    </div>
</template>

<script setup lang="ts" generic="T extends string | number | boolean | object">
import {computed, defineModel} from 'vue';

const modelValue = defineModel<T>({ required: true });

interface Props {
    color?: 'primary' | 'secondary' | 'gray' | 'warning' | 'danger';
    size?: 'small' | 'medium' | 'large';
    value: T
}
const props = withDefaults(defineProps<Props>(), {
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
        @apply text-purple-600 accent-purple-500 focus:ring-purple-500 dark:focus:ring-purple-600;
    }
    &.secondary {
        @apply text-blue-600 accent-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600;
    }
    &.gray {
        @apply text-gray-600 accent-gray-500 focus:ring-gray-500 dark:focus:ring-gray-600;
    }
    &.warning {
        @apply text-yellow-600 accent-yellow-500 focus:ring-yellow-500 dark:focus:ring-yellow-600;
    }
    &.danger {
        @apply text-red-600 accent-red-500 focus:ring-red-500 dark:focus:ring-red-600;
    }
}
</style>