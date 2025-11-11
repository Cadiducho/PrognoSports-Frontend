<template>
  <div>
    <!-- Elemento al que se le va a insertar el tooltip -->
    <div
      ref="referenceRef"
      class="inline-flex"
      @mouseenter="isOpen = true"
      @mouseleave="isOpen = false"
      @focus="isOpen = true"
      @blur="isOpen = false"
    >
      <slot />
    </div>

    <transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <!-- Tooltip -->
      <div
        v-if="isOpen"
        ref="floatingRef"
        :style="floatingStyles"
        class="fixed z-50"
      >
        <div class="bg-gray-900 text-white px-3 py-2 rounded-md text-sm shadow-lg dark:bg-white dark:text-gray-900 dark:shadow-gray-800 relative">
          <slot name="tooltip" />

          <!-- Flecha del tooltip -->
          <div
            ref="arrowRef"
            :style="arrowStyles"
            class="absolute w-2 h-2 transform rotate-45 bg-gray-900 dark:bg-white"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  useFloating,
  offset,
  shift,
  flip,
  arrow,
  autoUpdate,
} from '@floating-ui/vue'

const props = defineProps({
  placement: {
    type: String,
    default: 'top'
  }
})

const isOpen = ref(false)
const referenceRef = ref(null)
const floatingRef = ref(null)
const arrowRef = ref(null)

// Configuración de Floating UI
const { floatingStyles, middlewareData } = useFloating(referenceRef, floatingRef, {
  placement: props.placement,
  middleware: [
    offset(8),
    flip(),
    shift({ padding: 8 }),
    arrow({ element: arrowRef })
  ],
  whileElementsMounted: autoUpdate,
})

const arrowStyles = computed(() => {
  if (!middlewareData.value.arrow) return {}

  const { x, y } = middlewareData.value.arrow
  const staticSide = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  }[props.placement.split('-')[0]]

  return {
    left: x != null ? `${x}px` : '',
    top: y != null ? `${y}px` : '',
    [staticSide]: '-4px'
  }
})
</script>
