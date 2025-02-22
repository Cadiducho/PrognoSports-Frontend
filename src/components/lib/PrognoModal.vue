<template>
  <div
    tabindex="-1"
    aria-hidden="true"
    class="overflow-y-auto overflow-x-hidden fixed inset-0 z-50 flex justify-center items-center w-full"
  >
    <!--<div class="modal is-active">-->
    <div
      class="absolute top-0 right-0 bottom-0 left-0 bg-gray-800/80"
      @click="close()"
    />
    <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700 w-full md:w-1/2">
      <form @submit.prevent="handle()">
        <header class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            <slot name="title">
              Modal title
            </slot>
          </h3>
          <button
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="default-modal"

            @click="close()"
          >
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </header>
        <section class="p-4 md:p-5 space-y-4">
          <slot
            name="content"
            class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
          />
        </section>
        <footer class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
          <slot name="footer">
            <section class="space-x-2">
              <p-button
                native-type="submit"
              >
                <slot name="saveText">
                  Guardar cambios
                </slot>
              </p-button>
              <p-button
                color="warning"
                type="soft"
                @click="close()"
              >
                <slot name="cancelText">
                  Cancelar
                </slot>
              </p-button>
            </section>
          </slot>
        </footer>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">

import PButton from "@/components/lib/forms/PButton.vue";

const emit = defineEmits(['close', 'handle']);

const close = () => {
  emit('close');
}

const handle = () => {
  emit('handle');
}
</script>
