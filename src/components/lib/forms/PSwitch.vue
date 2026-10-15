<template>
  <label class="inline-flex items-center mb-5 cursor-pointer">
    <input
      class="sr-only peer"
      type="checkbox"
      :checked="model"
      @change="handleChange"
    >
    <div
      :class="switchClasses"
      class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4

        rounded-full peer dark:bg-gray-700
        peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white
        after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full
        after:w-5 after:h-5 after:transition-all dark:border-gray-600"
    />

    <span class="ms-3 text-gray-900 dark:text-gray-300 mr-4">
      <slot />
    </span>
  </label>
</template>

<script setup lang="ts">
import {computed} from "vue";

export interface Props {
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'gray';
    inactiveColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'gray';
}
const model = defineModel<boolean>({type: Boolean});

const props = withDefaults(defineProps<Props>(), {
    color: 'primary',
    inactiveColor: 'gray'
});

const emit = defineEmits<{
    onSwitch: [value: boolean]
}>();

const handleChange = (event: Event) => {
    model.value = (event.target as HTMLInputElement).checked;
    emit('onSwitch', (event.target as HTMLInputElement).checked);
}

const switchClasses = computed(() => {
    const activeClasses = {
        primary: 'peer-focus:ring-brand-500 dark:peer-focus:ring-brand-600 peer-checked:bg-brand-500',
        secondary: 'peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:bg-blue-600',
        success: 'peer-focus:ring-success-500 dark:peer-focus:ring-success-600 peer-checked:bg-success-500',
        warning: 'peer-focus:ring-warning-500 dark:peer-focus:ring-warning-600 peer-checked:bg-warning-500',
        danger: 'peer-focus:ring-error-500 dark:peer-focus:ring-error-600 peer-checked:bg-error-500',
        gray: 'peer-focus:ring-gray-500 dark:peer-focus:ring-gray-600 peer-checked:bg-gray-500'
    };
    const inactiveClasses = {
        primary: 'bg-brand-100 dark:bg-brand-900/40',
        secondary: 'bg-blue-100 dark:bg-blue-900/40',
        success: 'bg-success-100 dark:bg-success-900/40',
        warning: 'bg-warning-100 dark:bg-warning-900/40',
        danger: 'bg-error-100 dark:bg-error-900/40',
        gray: 'bg-gray-200 dark:bg-gray-700'
    };
    return `${activeClasses[props.color]} ${inactiveClasses[props.inactiveColor]}`;
});
</script>
