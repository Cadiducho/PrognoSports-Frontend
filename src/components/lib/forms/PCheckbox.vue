<template>
    <div class="flex items-center">
        <input id="checkbox" type="checkbox"
               :checked="modelValue"
               @change="handleChange"
               class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        >
        <label for="checkbox" class="ms-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <slot></slot>
        </label>
    </div>
</template>

<script setup lang="ts">
import { defineModel } from 'vue';

const modelValue = defineModel<boolean>({ required: true });

const handleChange = (event: Event) => {
    modelValue.value = (event.target as HTMLInputElement).checked;
};
</script>