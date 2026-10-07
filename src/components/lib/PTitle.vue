<template>
  <component
    :is="tag"
    :class="computedClass"
  >
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
    type?: 'title' | 'subtitle' | 'header' | 'section';
    align?: 'left' | 'center';
    noMargin?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    name: undefined,
    type: 'title',
    tag: 'h1',
    align: 'left',
    noMargin: false
});

const computedClass = computed(() => ({
    'font-semibold text-gray-900 dark:text-gray-100': true,
    'mb-3': !props.noMargin,
    'text-center': props.align === 'center',
    'text-2xl md:text-4xl': props.type === 'title',
    'text-xl md:text-2xl': props.type === 'subtitle',
    'text-lg md:text-xl': props.type === 'header',
    'text-xl md:text-2xl select-none': props.type === 'section',
}));
</script>
