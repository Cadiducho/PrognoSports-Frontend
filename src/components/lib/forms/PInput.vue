<template>
  <fieldset
    class="w-full"
    :class="{'mb-3': !noMargin}"
  >
    <p-label
      v-if="label"
      :for="id"
      :label="label"
      :message="message"
    >
      {{ props.label }}
    </p-label>
    <div class="relative">
      <span
        v-if="icon && !isTextarea"
        class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-300"
      >
        <i :class="icon" />
      </span>
      <textarea
        v-if="isTextarea"
        :id="id"
        v-model="model"
        v-bind="$attrs"
        :class="inputClasses"
        :maxlength="maxLenght"
        :name="name"
        :placeholder="placeholder"
        :rows="rows"
      />
      <input
        v-else
        :id="id"
        v-model="model"
        v-bind="$attrs"
        :class="inputClasses"
        :maxlength="maxLenght"
        :name="name"
        :type="type"
        :placeholder="placeholder"
      >
    </div>
  </fieldset>
</template>

<script setup lang="ts" generic="T">
import { computed, useId } from "vue";
import PLabel from "@/components/lib/forms/PLabel.vue";

const model = defineModel<T>();
const props = withDefaults(defineProps<{
  label?: string;
  message?: string;
  name?: string;
  maxLenght?: number;
  type?: string;
  placeholder?: string;
  icon?: string;
  noMargin?: boolean;
  isTextarea?: boolean;
  rows?: number;
}>(), {
  label: '',
  message: '',
  name: '',
  maxLenght: 128,
  type: 'text',
  placeholder: '',
  icon: undefined,
  noMargin: false,
  isTextarea: false,
  rows: 3
});

const id = useId();

const inputClasses = computed(() => [
  "appearance-none block w-full text-gray-700 dark:text-gray-200 border border-gray-200 rounded py-3 pr-4 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:ring-blue-500 focus:outline-none focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500",
  props.icon && !props.isTextarea ? "pl-12" : "pl-4"
]);
</script>
