<template>
  <component
    :is="computedTag"
    :type="computedNativeType"
    :disabled="computedDisabled"
    :to="to"
    :class="buttonClasses"
    @click="pushToLink"
  >
    <i
      v-if="icon"
      :class="`${icon} pr-1`"
    />
    <slot>
      {{ label }}
    </slot>
  </component>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from 'vue'
import {RouteLocationRaw, useRouter} from "vue-router";

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
        nativeType: {
            type: String,
            default: "button",
            validator: (value: string) =>
                ["button", "submit", "reset"].indexOf(value) >= 0,
        },
        size: {
            type: String as PropType<'small' | 'medium' | 'large'>,
            default: "medium"
        },
        expanded: {
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
            default: "primary"
        },
        icon: {
            type: String,
            default: ""
        },
        tag: {
            type: String as PropType<'button' | 'a' | 'router-link' | 'input'>,
            default: "button"
        },
        to: {
            type: [String, Object] as PropType<RouteLocationRaw>,
            default: ""
        }
    },
    setup(props) {
        const router = useRouter();

        const computedTag = computed(() =>
            typeof props.disabled !== "undefined" && props.disabled
                ? "button"
                : props.tag,
        );
        const computedNativeType = computed(() =>
            props.tag === "button" || props.tag === "input" ? props.nativeType : null,
        );
        const computedDisabled = computed(() => (props.disabled ? true : null));

        const pushToLink = () => {
            if (props.to) {
                router.push(props.to);
            }
        }

        const buttonClasses = computed(() => ({
            'inline-flex justify-center items-center gap-2': true, // Estilos base
            'small': props.size === 'small',
            'medium': props.size === 'medium',
            'large': props.size === 'large',
            'w-full': props.expanded,
            'rounded-full': props.pilled,
            'rounded-md': props.rounded && !props.pilled,

            'solid': props.type === 'solid',
            'outline': props.type === 'outline',
            'soft': props.type === 'soft',
            'ghost': props.type === 'ghost',
            'disabled': props.disabled,

            [props.color]: true // Colores tienen el mismo nombre que las clases
        }));

        return {pushToLink, computedTag, computedNativeType, computedDisabled, buttonClasses};
    }
});
</script>

<style lang="scss" scoped>
.small {
    @apply py-2 px-3 text-sm;
}
.medium {
    @apply py-2 px-4 text-base;
}
.large {
    @apply py-3 px-5 text-lg;
}
.solid {
    @apply border border-transparent shadow-sm font-semibold;

    &.teal {
        @apply bg-teal-400 hover:bg-teal-500 dark:focus:ring-offset-gray-800 text-white;
    }
    &.primary, &.purple {
        @apply bg-primary hover:bg-primary-hover dark:focus:ring-offset-gray-800 text-white;
    }
    &.red, &.danger {
        @apply bg-red-500 hover:bg-red-600 dark:focus:ring-offset-gray-800 text-white;
    }
    &.yellow, &.warning {
        @apply bg-yellow-600 hover:bg-yellow-600 dark:focus:ring-offset-gray-800 text-white;
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
        @apply text-yellow-600 border-yellow-600 hover:bg-yellow-600 hover:text-white;
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

    &.teal {
        @apply bg-teal-100 hover:bg-teal-200 dark:focus:ring-offset-gray-800 text-teal-500;
    }
    &.purple, &.primary {
        @apply bg-purple-100 hover:bg-purple-200 dark:focus:ring-offset-gray-800 text-purple-500;
    }
    &.red, &.danger {
        @apply bg-red-100 hover:bg-red-200 dark:focus:ring-offset-gray-800 text-red-500;
    }
    &.yellow, &.warning {
        @apply bg-yellow-100 hover:bg-yellow-200 dark:focus:ring-offset-gray-800 text-yellow-500 dark:text-yellow-900;
    }
    &.green, &.success {
        @apply bg-green-100 hover:bg-green-200 dark:focus:ring-offset-gray-800 text-green-500;
    }
    &.blue, &.info {
        @apply bg-blue-100 hover:bg-blue-200 dark:bg-blue-300 dark:focus:ring-offset-gray-800 text-blue-500 dark:text-blue-900;
    }
    &.pink {
        @apply bg-pink-100 hover:bg-pink-200 dark:focus:ring-offset-gray-800 text-pink-500;
    }
}
.ghost {
    @apply border border-transparent shadow-sm font-semibold;

    &.teal {
        @apply bg-transparent hover:bg-teal-100 dark:focus:ring-offset-gray-800 text-teal-500;
    }
    &.purple, &.primary {
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
