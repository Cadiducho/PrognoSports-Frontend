<template>
    <label class="inline-flex items-center mb-5 cursor-pointer">
        <input class="sr-only peer" type="checkbox"
               :checked="modelValue"
               @change="handleChange"
        >
        <div :class="switchClasses" class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4

        rounded-full peer dark:bg-gray-700
        peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white
        after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full
        after:w-5 after:h-5 after:transition-all dark:border-gray-600"></div>

        <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 mr-4">
            <slot></slot>
        </span>
    </label>
</template>
<script setup lang="ts">
import {computed} from "vue";

export interface Props {
    color?: 'primary' | 'secondary' | 'warning' | 'danger' | 'gray';
}
const props = withDefaults(defineProps<Props>(), {
    color: 'primary'
});

const model = defineModel<boolean>({type: Boolean});

const emit = defineEmits<{
    onSwitch: [value: boolean]
}>();

const handleChange = (event: Event) => {
    model.value = (event.target as HTMLInputElement).checked;
    emit('onSwitch', (event.target as HTMLInputElement).checked);
}

const switchClasses = computed(() => ({
    'switch': true, // Estilos base
    [props.color]: true // Colores tienen el mismo nombre que las clases de css
}));
</script>

<style lang="scss" scoped>
.switch {
    &.primary {
        @apply peer-focus:ring-purple-500 dark:peer-focus:ring-purple-600 peer-checked:bg-purple-500
    }
    &.secondary {
        @apply peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:bg-blue-600
    }
    &.warning {
        @apply peer-focus:ring-yellow-500 dark:peer-focus:ring-yellow-600 peer-checked:bg-yellow-500
    }
    &.danger {
        @apply peer-focus:ring-red-500 dark:peer-focus:ring-red-600 peer-checked:bg-red-500
    }
    &.gray {
        @apply peer-focus:ring-gray-500 dark:peer-focus:ring-gray-600 peer-checked:bg-gray-500
    }
}
</style>