<script setup lang="ts">
import {computed, StyleValue} from "vue";

interface Props {
  tag?: 'article' | 'div' | 'section' | 'router-link';
  title?: string;
  /** Estilo inline para la cabecera (por ejemplo, el color de un equipo) */
  headerStyle?: StyleValue;
  headerClass?: string;
  padding?: 'none' | 'sm' | 'md';
}
const props = withDefaults(defineProps<Props>(), {
  tag: 'article',
  title: undefined,
  headerStyle: undefined,
  headerClass: '',
  padding: 'md'
});

const paddingClass = computed(() => ({
  none: '',
  sm: 'p-3',
  md: 'p-3 sm:p-5'
}[props.padding]));
</script>

<template>
  <component
    :is="props.tag"
    class="block max-w-full overflow-hidden rounded-lg bg-white text-gray-800 shadow-lg shadow-black/10 ring-1 ring-black/5 dark:bg-gray-900 dark:text-gray-300 dark:shadow-white/5 dark:ring-white/10"
  >
    <header
      v-if="props.title || $slots.header"
      :class="['border-b border-gray-200 px-3 py-3 font-semibold dark:border-gray-700 sm:px-5', props.headerClass]"
      :style="props.headerStyle"
    >
      <slot name="header">
        {{ props.title }}
      </slot>
    </header>
    <div :class="paddingClass">
      <slot />
    </div>
    <footer
      v-if="$slots.footer"
      class="flex border-t border-gray-200 dark:border-gray-700"
    >
      <slot name="footer" />
    </footer>
  </component>
</template>
