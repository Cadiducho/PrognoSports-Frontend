<template>
  <fieldset
    class="w-full"
    :class="{'mb-3': !noMargin}"
  >
    <p-label
      v-if="label"
      :for="name"
    >
      {{ props.label }}
    </p-label>
    <input
      :id="name"
      v-bind="$attrs"
      v-model="model"
      class="appearance-none block w-full text-gray-700 dark:text-gray-200 border border-gray-200 rounded py-3 px-4 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:ring-blue-500 focus:outline-none focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
      :maxlength="maxLenght"
      :name="name"
      :type="type"
      :placeholder="placeholder"
    >
  </fieldset>
</template>

<script setup lang="ts" generic="T">
import PLabel from "@/components/lib/forms/PLabel.vue";

const model = defineModel<T>();

const props = withDefaults(defineProps<{
  label?: string;
  name?: string;
  maxLenght?: number;
  type?: string;
  placeholder?: string;
  icon?: string;
  noMargin?: boolean;
}>(), {
  label: '',
  name: '',
  maxLenght: 128,
  type: 'text',
  placeholder: '',
  icon: '',
  noMargin: false
});
</script>
