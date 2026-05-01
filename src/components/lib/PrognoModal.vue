<template>
  <Teleport :to="props.teleportTo">
    <Transition name="progno-modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex w-full items-center justify-center overflow-y-auto overflow-x-hidden"
      >
        <!-- overlay -->
        <div
          class="absolute inset-0 bg-gray-800/80"
          @click="onOverlayClick"
        />

        <!-- dialog -->
        <div
          ref="dialogEl"
          class="relative w-full rounded-lg bg-white shadow-sm dark:dark:bg-gray-900 md:w-1/2"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="ariaLabelledby"
          :aria-label="ariaLabel"
          tabindex="-1"
          @click.stop
        >
          <form @submit.prevent="handle">
            <header class="flex items-center justify-between border-b border-gray-200 p-4 rounded-t dark:border-gray-600 md:p-5">
              <h3
                :id="titleId"
                class="text-xl font-semibold text-gray-900 dark:text-white"
              >
                <slot name="title">
                  {{ props.title }}
                </slot>
              </h3>
              <button
                ref="closeButtonEl"
                type="button"
                class="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                @click="close('button')"
              >
                <svg
                  class="h-3 w-3"
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
                <span class="sr-only">Cerrar modal</span>
              </button>
            </header>
            <section class="space-y-4 p-4 text-base leading-relaxed text-gray-500 dark:text-gray-400 md:p-5">
              <slot name="content" />
            </section>
            <footer class="flex items-center border-t border-gray-200 p-4 rounded-b dark:border-gray-600 md:p-5">
              <slot name="footer">
                <section class="space-x-2">
                  <p-button native-type="submit">
                    <slot name="saveText">
                      Guardar cambios
                    </slot>
                  </p-button>
                  <p-button
                    color="info"
                    type="soft"
                    @click="close('button')"
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
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import PButton from "@/components/lib/forms/PButton.vue";

import { computed, nextTick, onBeforeUnmount, useSlots, useTemplateRef, watch } from "vue";
import { lockBodyScroll, nextModalDomId, unlockBodyScroll } from "@/components/lib/modal/modalGlobals";

type CloseReason = 'overlay' | 'esc' | 'button';

const props = withDefaults(defineProps<{
  title?: string;

  /** Cierra el modal al hacer click en el overlay */
  closeOnOverlay?: boolean;

  /** Cierra el modal al pulsar ESC */
  closeOnEsc?: boolean;

  /** Bloquea el scroll del body mientras el modal está abierto */
  lockScroll?: boolean;

  /** Selector/elemento destino del teleport */
  teleportTo?: string;

  /** Si no hay título, se usará como aria-label */
  ariaLabel?: string;
}>(), {
  title: '',
  closeOnOverlay: true,
  closeOnEsc: true,
  lockScroll: true,
  teleportTo: 'body',
  ariaLabel: '',
});

const emit = defineEmits<{
  close: [reason?: CloseReason];
  handle: [];
}>();

// Si el consumidor no hace binding (sin v-model), el modal se comporta como antes: visible al montar.
const isOpen = defineModel<boolean>({ default: true });

const titleId = nextModalDomId('progno-modal-title');

const slots = useSlots();
const hasTitle = computed(() => Boolean(props.title) || Boolean(slots.title));
const ariaLabelledby = computed(() => (hasTitle.value ? titleId : undefined));
const ariaLabel = computed(() => (!hasTitle.value ? (props.ariaLabel || 'Diálogo') : undefined));

const dialogEl = useTemplateRef<HTMLElement>('dialogEl');
const closeButtonEl = useTemplateRef<HTMLButtonElement>('closeButtonEl');

let lastActiveElement: Element | null = null;

const getFocusableElements = (): HTMLElement[] => {
  const root = dialogEl.value;
  if (!root) {
    return [];
  }

  const selector = [
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(',');

  return Array.from(root.querySelectorAll<HTMLElement>(selector))
    .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
};

const trapTabKey = (e: KeyboardEvent) => {
  if (e.key !== 'Tab') {
    return;
  }

  const focusables = getFocusableElements();
  if (!focusables.length) {
    e.preventDefault();
    dialogEl.value?.focus();
    return;
  }

  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement as HTMLElement | null;

  if (e.shiftKey) {
    if (!active || active === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (!active || active === last) {
      e.preventDefault();
      first.focus();
    }
  }
};

const close = (reason: CloseReason = 'button') => {
  if (!isOpen.value) {
    return;
  }
  isOpen.value = false;
  emit('close', reason);
}

const handle = () => {
  emit('handle');
}

const onOverlayClick = () => {
  if (!props.closeOnOverlay) {
    return;
  }
  close('overlay');
}

const onGlobalKeydown = (e: KeyboardEvent) => {
  if (!isOpen.value) {
    return;
  }

  if (e.key === 'Escape' && props.closeOnEsc) {
    e.preventDefault();
    close('esc');
    return;
  }

  trapTabKey(e);
}

const focusInitialElement = async () => {
  await nextTick();

  // 1) Botón de cerrar (si existe)
  if (closeButtonEl.value) {
    closeButtonEl.value.focus();
    return;
  }

  // 2) Primer elemento enfocable
  const focusables = getFocusableElements();
  if (focusables.length) {
    focusables[0].focus();
    return;
  }

  // 3) El propio diálogo
  dialogEl.value?.focus();
}

watch(
  isOpen,
  async (open) => {
    if (typeof window === 'undefined') {
      return;
    }

    if (open) {
      lastActiveElement = document.activeElement;

      if (props.lockScroll) {
        lockBodyScroll();
      }

      window.addEventListener('keydown', onGlobalKeydown);
      await focusInitialElement();
    } else {
      window.removeEventListener('keydown', onGlobalKeydown);

      if (props.lockScroll) {
        unlockBodyScroll();
      }

      // Devuelvo el foco a quien lo tenía antes de abrir el modal
      const el = lastActiveElement as HTMLElement | null;
      el?.focus?.();
      lastActiveElement = null;
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (typeof window === 'undefined') {
    return;
  }

  window.removeEventListener('keydown', onGlobalKeydown);
  if (props.lockScroll && isOpen.value) {
    unlockBodyScroll();
  }
});
</script>

<style scoped>
.progno-modal-enter-active,
.progno-modal-leave-active {
  transition: opacity 0.15s ease;
}

.progno-modal-enter-from,
.progno-modal-leave-to {
  opacity: 0;
}
</style>

