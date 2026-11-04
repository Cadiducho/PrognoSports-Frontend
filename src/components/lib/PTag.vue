<template>
  <span
    :class="[
      'inline-flex items-center font-medium transition-colors select-none',
      sizeClasses,
      colorClasses,
      variantClasses
    ]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TagColor, TagSize } from '@/types/components'

const props = defineProps<{
  color?: TagColor
  size?: TagSize,
  variant?: 'rounded' | 'default',
  /** `soft`: fondo suave con texto oscuro, de mayor contraste que el sólido (que usa texto blanco) */
  appearance?: 'solid' | 'soft'
}>()

const color = computed(() => props.color || 'neutral')
const size = computed(() => props.size || 'medium')

const softClasses: Record<TagColor, Array<string>> = {
  warning: ['bg-warning-100 text-warning-900', 'dark:bg-warning-900/40 dark:text-warning-100'],
  info: ['bg-info-100 text-info-900', 'dark:bg-info-900/40 dark:text-info-100'],
  error: ['bg-error-100 text-error-900', 'dark:bg-error-900/40 dark:text-error-100'],
  success: ['bg-success-100 text-success-900', 'dark:bg-success-900/40 dark:text-success-100'],
  pink: ['bg-pink-100 text-pink-900', 'dark:bg-pink-900/40 dark:text-pink-100'],
  primary: ['bg-brand-100 text-brand-900', 'dark:bg-brand-900/40 dark:text-brand-100'],
  neutral: ['bg-gray-100 text-gray-800', 'dark:bg-gray-800 dark:text-gray-100'],
}

const colorClasses = computed(() => {
  if (props.appearance === 'soft') {
    return softClasses[color.value]
  }
  switch (color.value) {
    case 'warning':
      return [
        'bg-warning-500 text-white',
        'dark:bg-warning-400 dark:text-warning-900',
      ]
    case 'info':
      return [
        'bg-info-500 text-white',
        'dark:bg-info-400 dark:text-info-900',
      ]
    case 'error':
      return [
        'bg-error-500 text-white',
        'dark:bg-error-400 dark:text-error-900',
      ]
    case 'success':
      return [
        'bg-success-500 text-white',
        'dark:bg-success-400 dark:text-success-900',
      ]
    case 'pink':
      return [
        'bg-pink-500 text-white',
        'dark:bg-pink-400 dark:text-pink-900',
      ]
    case 'primary':
      return [
        'bg-brand-accent-500 text-gray-light-50 dark:text-gray-light-50',
      ]
    default:
      return [
        'bg-white text-gray-700 border border-gray-200',
        'dark:bg-transparent dark:text-gray-100 dark:border-gray-700',
      ]
  }
})

const sizeClasses = computed(() => {
  switch (size.value) {
    case 'small':
      return 'text-xs px-2 py-0.5'
    case 'large':
      return 'text-lg px-4 py-2'
    default:
      return 'text-sm px-3 py-1'
  }
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'rounded':
      return 'rounded-full'
    default:
      return 'rounded-sm'
  }
})
</script>
