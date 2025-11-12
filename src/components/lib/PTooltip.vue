<template>
  <div
    class="inline-flex"
  >
    <!-- Elemento al que se le va a insertar el tooltip -->
    <div
      ref="referenceRef"
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
        <div :class="tooltipClasses">
          <slot name="tooltip">
            {{ props.label }}
          </slot>

          <!-- Flecha del tooltip -->
          <div
            ref="arrowRef"
            :style="arrowStyles"
            :class="arrowClasses"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  useFloating,
  offset,
  shift,
  flip,
  arrow,
  autoUpdate,
} from '@floating-ui/vue'

const props = withDefaults(defineProps<{
  label?: string;
  placement?: Placement;
  variant?: 'default' | 'danger' | 'success' | 'warning' | 'info';
}>(), {
  label: '',
  placement: 'top',
  variant: 'default'
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


const tooltipClasses = computed(() => {
  const baseClasses = 'px-3 py-2 rounded-md text-sm shadow-lg relative'

  const variants = {
    default: 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 dark:shadow-gray-800',
    danger: 'bg-red-600 text-white shadow-red-800',
    success: 'bg-green-500 text-white shadow-green-700',
    warning: 'bg-yellow-500 text-gray-900 shadow-yellow-700',
    info: 'bg-blue-600 text-white shadow-blue-800'
  }

  return `${baseClasses} ${variants[props.variant]}`
})

const arrowClasses = computed(() => {
  const baseClasses = 'absolute w-2 h-2 transform rotate-45'

  const variants = {
    default: 'bg-gray-900 dark:bg-white',
    danger: 'bg-red-600',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-600'
  }

  return `${baseClasses} ${variants[props.variant]}`
})
</script>
