<template>
    <div class="w-full mb-3">
        <label v-if="label" class="block tracking-wide text-gray-700 dark:text-gray-300 font-bold mb-2" :for="name">
            {{ label }}
        </label>
        <input
            class="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-600"
            :maxlength="maxLenght" :id="name" :name="name"
            :type="type" :placeholder="placeholder"
            v-bind="$attrs"
            v-model="model"
        />
    </div>
</template>

<script setup lang="ts">
const model = defineModel();

export interface Props {
    label?: string;
    name?: string;
    maxLenght?: number;
    type?: string;
    placeholder?: string;
    icon?: string;
}
const props = withDefaults(defineProps<Props>(), {
    label: '',
    name: '',
    maxLenght: 128,
    type: 'text',
    placeholder: '',
    icon: '',
});
</script>
