<template>
  <fieldset>
    <label
      v-if="label"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      {{ label }}
    </label>
    <section class="relative">
      <select
        v-model="modelValue"
        :multiple="props.multiple"
        :disabled="props.disabled"
        :class="selectClasses"
      >
        <!-- Si hay un placeholder, se muestra -->
        <template v-if="placeholder || $slots.placeholder">
          <option
            v-if="placeholderVisible"
            value=""
            disabled
            hidden
          >
            <!--
            @slot Slot para el texto del placeholder
        -->
            <slot name="placeholder">
              {{ placeholder }}
            </slot>
          </option>
        </template>

        <!--
        @slot Slot para las opciones del select con <option>
    -->
        <slot />
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 px-3 flex items-center">
        <i
          class="fa fa-chevron-down text-gray-900"
        />
      </div>
    </section>
  </fieldset>
</template>

<script setup lang="ts" generic="T extends string | number | boolean | object">
import {computed} from "vue";

export interface Props {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'gray' | 'warning' | 'danger';
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
}

const modelValue = defineModel<T>({required: true});

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  color: 'primary',
  label: undefined,
  placeholder: 'Selecciona una opción',
  disabled: false,
  multiple: false,
});

const placeholderVisible = computed(() => !props.multiple && modelValue.value === "");

const selectClasses = computed(() => ({
  'select': true, // Estilos base
  'disabled': props.disabled,
  [props.color]: true, // Colores tienen el mismo nombre que las clases de css
  'small': props.size === 'small',
  'medium': props.size === 'medium',
  'large': props.size === 'large',
}));

</script>

<style scoped lang="scss">
.select {
  @apply appearance-none block bg-none bg-gray-200 border border-transparent rounded-md py-2 pl-3 pr-10 text-base text-contrast-dark focus:outline-none focus:ring-white focus:border-white
}
</style>
