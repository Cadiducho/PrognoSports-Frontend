<template>
  <div
    class="grid grid-cols-1 items-start gap-x-4 gap-y-4 *:m-0!"
    :class="colsClass"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";

/**
 * Rejilla responsive para los campos de un formulario (`PInput`, `PSelect`, `PField`...). En móvil va a
 * una columna y crece según `cols`. El espaciado lo marca la rejilla, así que se anulan los márgenes
 * propios de los campos. Un campo puede ocupar más columnas con su prop `span`.
 *
 * ```vue
 * <PFormGrid :cols="2">
 *   <PInput label="Nombre" />
 *   <PInput label="Apellido" />
 *   <PField label="Notas" span="full">...</PField>
 * </PFormGrid>
 * ```
 */
const props = withDefaults(defineProps<{
  cols?: 1 | 2 | 3 | 4;
}>(), {
  cols: 2,
});

// Clases completas y estáticas para que Tailwind las detecte
const COLS_CLASSES = {
  1: '',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
} as const;

const colsClass = computed(() => COLS_CLASSES[props.cols]);
</script>
