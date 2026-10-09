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
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-300"
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
  size?: 'small' | 'medium' | 'large';
  error?: boolean;
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
  rows: 3,
  size: 'medium',
  error: false
});

const id = useId();

const sizeClasses = {
  small: "py-1 text-sm",
  medium: "py-2 text-base",
  large: "py-3 text-lg"
};

const inputClasses = computed(() => [
  "block w-full appearance-none rounded-md border border-gray-300 bg-white pr-4 leading-normal text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder:text-gray-400",
  sizeClasses[props.size],
  props.error ? "!border-error-500 focus:!ring-error-500 dark:!border-error-400" : "",
  props.icon && !props.isTextarea ? "pl-10" : "pl-3"
]);
</script>
