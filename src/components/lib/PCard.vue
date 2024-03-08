<script setup lang="ts">
interface Props {
    tag?: 'article' | 'div' | 'router-link';
}
const props = withDefaults(defineProps<Props>(), {
    tag: 'article'
});
</script>

<template>
    <component :is="tag" class="bg-contrast dark:bg-contrast-dark shadow-md rounded-lg max-w-full">
        <slot></slot>
    </component>
</template>