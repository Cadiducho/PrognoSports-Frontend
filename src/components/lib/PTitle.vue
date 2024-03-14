<template>
    <component :is="tag" :class="computedClass">
        <slot>
            {{ name }}
        </slot>
    </component>
</template>

<script setup lang="ts">
import {computed} from "vue";

interface Props {
    name?: string;
    tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
    type?: 'title' | 'subtitle';
}
const props = withDefaults(defineProps<Props>(), {
    type: 'title',
    tag: 'h1'
});

const computedClass = computed(() => ({
    'font-semibold text-black dark:text-gray-200 mb-3': true,
    'text-2xl md:text-4xl': props.type === 'title',
    'text-xl md:text-2xl': props.type === 'subtitle'
}));
</script>