<template>
  <div class="flex items-center mb-4 me-4">
    <input
      :id="`checkbox-${id}`"
      type="checkbox"
      :checked="(modelValue) ? modelValue : checked"
      :class="checkboxClasses"
      @change="handleChange"
    >
    <label
      :for="`checkbox-${id}`"
      class="ms-2 text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      <slot />
    </label>
  </div>
</template>

<script setup lang="ts">
import {computed, defineModel} from 'vue';

const modelValue = defineModel<boolean>({required: false});

const props = withDefaults(defineProps<{
  color?: 'primary' | 'secondary' | 'gray' | 'warning' | 'danger';
  id?: number;
  checked?: boolean
}>(), {
  color: 'primary',
  id: 0,
  checked: false
});

const handleChange = (event: Event) => {
  modelValue.value = (event.target as HTMLInputElement).checked;
};

const checkboxClasses = computed(() => ({
  'checkbox': true, // Estilos base
  [props.color]: true // Colores tienen el mismo nombre que las clases de css
}));

</script>

<style lang="scss" scoped>
.checkbox {
  @apply cursor-pointer w-5 h-5 rounded focus:ring-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800;

  &.primary {
    @apply text-purple-600 accent-purple-500 focus:ring-purple-500 dark:focus:ring-purple-600;
  }

  &.secondary {
    @apply text-blue-600 accent-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600;
  }

  &.gray {
    @apply text-gray-600 accent-gray-500 focus:ring-gray-500 dark:focus:ring-gray-600;
  }

  &.warning {
    @apply text-yellow-600 accent-yellow-500 focus:ring-yellow-500 dark:focus:ring-yellow-600;
  }

  &.danger {
    @apply text-red-600 accent-red-500 focus:ring-red-500 dark:focus:ring-red-600;
  }
}
</style>
