<template>
    <button type="button" class="m-1 inline-flex justify-center items-center gap-2"
        :class="{
            'small': size === 'small',
            'medium': size === 'medium',
            'large': size === 'large',
            'w-full': block,
            'rounded-full': pilled,
            'rounded-md': rounded,

            'solid': type === 'solid',
            'outline': type === 'outline',
            'soft': type === 'soft',
            'ghost': type === 'ghost',
            'disabled': disabled,

            'purple': color === 'purple',
            'pink': color === 'pink',
            'primary': color === 'primary',
            'teal': color === 'teal',
            'info': color === 'info',
            'success': color === 'success',
            'warning': color === 'warning',
            'danger': color === 'danger',
            'red': color === 'red',
            'yellow': color === 'yellow',
            'green': color === 'green',
            'blue': color === 'blue',

    }">
        {{ label }}
    </button>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'

export default defineComponent({
    name: "PButton",
    props: {
        label: {
            type: String,
            default: ""
        },
        type: {
            type: String as PropType<'solid' | 'outline' | 'soft' | 'ghost'>,
            default: "solid"
        },
        size: {
            type: String as PropType<'small' | 'medium' | 'large'>,
            default: "medium"
        },
        block: {
            type: Boolean,
            default: false
        },
        pilled: {
            type: Boolean,
            default: false
        },
        rounded: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        color: {
            type: String as PropType<'primary' | 'success' | 'danger' | 'warning' | 'info' | 'red' | 'yellow' | 'green' | 'teal' | 'blue' | 'purple' | 'pink'>,
            default: "purple"
        },
        icon: {
            type: String,
            default: ""
        },
    },
});
</script>

<style lang="scss" scoped>
.small {
    @apply py-2 px-3 text-xs;
}
.medium {
    @apply py-2 px-4 text-sm;
}
.large {
    @apply py-3 px-5 text-base;
}
.solid {
    @apply border border-transparent shadow-sm font-semibold;

    &.teal, &.primary {
        @apply bg-teal-400 hover:bg-teal-500 dark:focus:ring-offset-gray-800 text-white;
    }
    &.purple {
        @apply bg-purple-500 hover:bg-purple-600 dark:focus:ring-offset-gray-800 text-white;
    }
    &.red, &.danger {
        @apply bg-red-500 hover:bg-red-600 dark:focus:ring-offset-gray-800 text-white;
    }
    &.yellow, &.warning {
        @apply bg-yellow-500 hover:bg-yellow-600 dark:focus:ring-offset-gray-800 text-white;
    }
    &.green, &.success {
        @apply bg-green-500 hover:bg-green-600 dark:focus:ring-offset-gray-800 text-white;
    }
    &.blue, &.info {
        @apply bg-blue-500 hover:bg-blue-600 dark:focus:ring-offset-gray-800 text-white;
    }
    &.pink {
        @apply bg-pink-500 hover:bg-pink-600 dark:focus:ring-offset-gray-800 text-white;
    }
}
.outline {
    @apply border-0 shadow-sm font-semibold;

    &.teal, &.primary {
        @apply text-teal-500 border-teal-500 hover:bg-teal-500 hover:text-white;
    }
    &.purple {
        @apply text-purple-500 border-purple-500 hover:bg-purple-500 hover:text-white;
    }
    &.red, &.danger {
        @apply text-red-500 border-red-500 hover:bg-red-500 hover:text-white;
    }
    &.yellow, &.warning {
        @apply text-yellow-500 border-yellow-500 hover:bg-yellow-500 hover:text-white;
    }
    &.green, &.success {
        @apply text-green-500 border-green-500 hover:bg-green-500 hover:text-white;
    }
    &.blue, &.info {
        @apply text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white;
    }
    &.pink {
        @apply text-pink-500 border-pink-500 hover:bg-pink-500 hover:text-white;
    }
}
.soft {
    @apply border border-transparent shadow-sm font-semibold;

    &.teal, &.primary {
        @apply bg-teal-100 hover:bg-teal-200 dark:focus:ring-offset-gray-800 text-teal-500;
    }
    &.purple {
        @apply bg-purple-100 hover:bg-purple-200 dark:focus:ring-offset-gray-800 text-purple-500;
    }
    &.red, &.danger {
        @apply bg-red-100 hover:bg-red-200 dark:focus:ring-offset-gray-800 text-red-500;
    }
    &.yellow, &.warning {
        @apply bg-yellow-100 hover:bg-yellow-200 dark:focus:ring-offset-gray-800 text-yellow-500;
    }
    &.green, &.success {
        @apply bg-green-100 hover:bg-green-200 dark:focus:ring-offset-gray-800 text-green-500;
    }
    &.blue, &.info {
        @apply bg-blue-100 hover:bg-blue-200 dark:focus:ring-offset-gray-800 text-blue-500;
    }
    &.pink {
        @apply bg-pink-100 hover:bg-pink-200 dark:focus:ring-offset-gray-800 text-pink-500;
    }
}
.ghost {
    @apply border border-transparent shadow-sm font-semibold;

    &.teal, &.primary {
        @apply bg-transparent hover:bg-teal-100 dark:focus:ring-offset-gray-800 text-teal-500;
    }
    &.purple {
        @apply bg-transparent hover:bg-purple-100 dark:focus:ring-offset-gray-800 text-purple-500;
    }
    &.red, &.danger {
        @apply bg-transparent hover:bg-red-100 dark:focus:ring-offset-gray-800 text-red-500;
    }
    &.yellow, &.warning {
        @apply bg-transparent hover:bg-yellow-100 dark:focus:ring-offset-gray-800 text-yellow-500;
    }
    &.green, &.success {
        @apply bg-transparent hover:bg-green-100 dark:focus:ring-offset-gray-800 text-green-500;
    }
    &.blue, &.info {
        @apply bg-transparent hover:bg-blue-100 dark:focus:ring-offset-gray-800 text-blue-500;
    }
    &.pink {
        @apply bg-transparent hover:bg-pink-100 dark:focus:ring-offset-gray-800 text-pink-500;
    }
}
.disabled {
    @apply opacity-50 cursor-not-allowed;
}
</style>