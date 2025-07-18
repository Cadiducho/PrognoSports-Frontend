<template>
  <div
    v-if="visible"
    :class="alertClasses"
    role="alert"
  >
    <svg
      v-if="icon"
      class="w-6 h-6 mr-2"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        :d="iconPath"
      />
    </svg>

    <p class="mb-0">
      <slot>{{ message }}</slot>
    </p>

    <button
      v-if="closable"
      class="ml-auto"
      @click="closeAlert"
    >
      <svg
        class="w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";

const props = withDefaults(defineProps<{
  message?: string,
  variant?: 'warning' | 'danger' | 'success' | 'info',
  icon?: boolean,
  closable?: boolean
}>(), {
  message: "",
  variant: "info",
  icon: true,
  closable: false
});
const emit = defineEmits<{
  afterClose: [value: boolean]
}>();
const visible = ref(true);
const closeAlert = () => {
  visible.value = false;
  emit('afterClose', visible.value);
};

const alertClasses = computed(() => {
  const baseClasses = "flex items-center text-sm font-bold px-4 py-3 mb-4 rounded";
  const variantClasses = {
    info: "bg-blue-100 dark:bg-blue-400 text-blue-700 dark:text-white border-blue-500",
    danger: "bg-error-100 text-error-500 border border-error-200",
    warning: "bg-warning-100 border border-warning-200 text-warning-600",
    success: "bg-green-100 border border-green-200 text-green-500"
  };
  return `${baseClasses} ${variantClasses[props.variant || 'info']}`;
});

const iconPath = computed(() => {
  const paths = {
    info: "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z",
    danger: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
    warning: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5",
    success: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
  };
  return paths[props.variant || 'info'];
});
</script>
