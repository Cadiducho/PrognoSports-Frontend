<template>
    <div class="w-full mb-3">
        <label v-if="label" class="block tracking-wide text-gray-700 font-bold mb-2" :for="name">
            {{ label }}
        </label>
        <input
            class="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-600"
            :maxlength="maxLenght" :id="name" :name="name"
            :type="type" :placeholder="placeholder"
            :value="modelValue"
            v-bind="$attrs"
            @input="$emit('update:modelValue', $event.target.value)"
        />
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
    name: "PInput",
    emits: ['update:modelValue'],
    props: {
        modelValue: {
            default: ''
        },
        label: {
            type: String,
            required: false,
        },
        name: {
            type: String,
            required: false,
        },
        maxLenght: {
            type: Number,
            required: false,
            default: 128,
        },
        type: {
            type: String,
            default: 'text'
        },
        placeholder: {
            type: String,
            required: false,
            default: '',
        },
        icon: {
            type: String,
            default: ""
        },
    },
})
</script>