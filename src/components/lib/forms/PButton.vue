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
            'h-max inline-flex justify-center items-center gap-2': true, // Estilos base
            'small': props.size === 'small',
            'medium': props.size === 'medium',
            'large': props.size === 'large',
            'w-full': props.expanded,
            'rounded-full': props.pilled,
            'rounded-md': props.rounded && !props.pilled,

            'solid': props.type === 'solid',
            'outline-pbutton': props.type === 'outline',
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
  @apply py-1 px-3 text-sm;
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
    @apply bg-tertiary-500 hover:bg-tertiary-600 dark:focus:ring-offset-gray-dark-900 text-gray-light-50 dark:text-gray-dark-900;
  }
  &.primary, &.purple {
    @apply bg-brand-accent-500 hover:bg-brand-accent-600 text-gray-light-50 dark:text-gray-light-50;
  }
  &.red, &.danger {
    @apply bg-error-500 hover:bg-error-600 dark:focus:ring-offset-gray-dark-900 text-gray-light-50;
  }
  &.yellow, &.warning {
    @apply bg-warning-500 hover:bg-warning-600 dark:focus:ring-offset-gray-dark-900 text-gray-dark-900 dark:text-gray-light-50;
  }
  &.green, &.success {
    @apply bg-success-500 hover:bg-success-600 dark:focus:ring-offset-gray-dark-900 text-gray-light-50;
  }
  &.blue, &.info {
    @apply bg-azure-500 hover:bg-azure-600 dark:focus:ring-offset-gray-dark-900 text-gray-light-50;
  }
  &.pink {
    @apply bg-pink-500 hover:bg-pink-600 dark:focus:ring-offset-gray-dark-900 text-gray-light-50;
  }
}
.outline-pbutton {
  @apply border border-current shadow-sm font-semibold bg-transparent;

  &.teal {
    @apply text-tertiary-500 hover:bg-tertiary-500 hover:text-gray-light-50 dark:hover:text-gray-dark-900;
  }
  &.primary, &.purple {
    @apply text-brand-accent-500 hover:bg-brand-accent-500 hover:text-gray-light-50 dark:hover:text-gray-dark-900;
  }
  &.red, &.danger {
    @apply text-error-500 hover:bg-error-500 hover:text-gray-light-50;
  }
  &.yellow, &.warning {
    @apply text-warning-500 hover:bg-warning-500 hover:text-gray-dark-900 dark:hover:text-gray-light-50;
  }
  &.green, &.success {
    @apply text-success-500 hover:bg-success-500 hover:text-gray-light-50;
  }
  &.blue, &.info {
    @apply text-azure-500 hover:bg-azure-500 hover:text-gray-light-50;
  }
  &.pink {
    @apply text-pink-500 hover:bg-pink-500 hover:text-gray-light-50;
  }
}
.soft {
  @apply border border-transparent shadow-sm font-semibold;

  &.teal {
    @apply bg-tertiary-100 hover:bg-tertiary-200 dark:bg-tertiary-900/30 dark:hover:bg-tertiary-800/50 text-tertiary-600 dark:text-tertiary-300;
  }
  &.primary, &.purple {
    @apply bg-brand-100 hover:bg-brand-200 dark:bg-brand-900/30 dark:hover:bg-brand-800/50 text-brand-600 dark:text-brand-300;
  }
  &.red, &.danger {
    @apply bg-error-100 hover:bg-error-200 dark:bg-error-900/30 dark:hover:bg-error-800/50 text-error-600 dark:text-error-300;
  }
  &.yellow, &.warning {
    @apply bg-warning-100 hover:bg-warning-200 dark:bg-warning-900/30 dark:hover:bg-warning-800/50 text-warning-600 dark:text-warning-300;
  }
  &.green, &.success {
    @apply bg-success-100 hover:bg-success-200 dark:bg-success-900/30 dark:hover:bg-success-800/50 text-success-600 dark:text-success-300;
  }
  &.blue, &.info {
    @apply bg-azure-100 hover:bg-azure-200 dark:bg-azure-900/30 dark:hover:bg-azure-800/50 text-azure-600 dark:text-azure-300;
  }
  &.pink {
    @apply bg-pink-100 hover:bg-pink-200 dark:bg-pink-900/30 dark:hover:bg-pink-800/50 text-pink-600 dark:text-pink-300;
  }
}
.ghost {
  @apply border border-transparent shadow-sm font-semibold bg-transparent;

  &.teal {
    @apply hover:bg-tertiary-100 dark:hover:bg-tertiary-900/30 text-tertiary-600 dark:text-tertiary-300;
  }
  &.primary, &.purple {
    @apply hover:bg-brand-100 dark:hover:bg-brand-900/30 text-brand-600 dark:text-brand-300;
  }
  &.red, &.danger {
    @apply hover:bg-error-100 dark:hover:bg-error-900/30 text-error-600 dark:text-error-300;
  }
  &.yellow, &.warning {
    @apply hover:bg-warning-100 dark:hover:bg-warning-900/30 text-warning-600 dark:text-warning-300;
  }
  &.green, &.success {
    @apply hover:bg-success-100 dark:hover:bg-success-900/30 text-success-600 dark:text-success-300;
  }
  &.blue, &.info {
    @apply hover:bg-azure-100 dark:hover:bg-azure-900/30 text-azure-600 dark:text-azure-300;
  }
  &.pink {
    @apply hover:bg-pink-100 dark:hover:bg-pink-900/30 text-pink-600 dark:text-pink-300;
  }
}
.disabled {
  @apply opacity-50 cursor-not-allowed;
}
</style>
