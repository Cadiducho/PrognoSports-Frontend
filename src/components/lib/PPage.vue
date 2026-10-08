<template>
  <PContainer
    :size="size"
    class="flex flex-col gap-4 !px-0"
  >
    <template v-if="breadcrumb">
      <Breadcrumb class="hidden sm:block" />
      <router-link
        v-if="parent"
        :to="parent.to"
        class="text-sm text-gray-600 hover:underline dark:text-gray-300 sm:hidden"
      >
        <i class="fas fa-chevron-left text-xs" />
        {{ parent.title }}
      </router-link>
    </template>

    <header class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <PTitle
          :name="heading"
          no-margin
        />
        <p
          v-if="subtitle"
          class="mt-1 text-gray-500 dark:text-gray-400"
        >
          {{ subtitle }}
        </p>
      </div>
      <div
        v-if="$slots.actions"
        class="flex flex-wrap gap-2"
      >
        <slot name="actions" />
      </div>
    </header>

    <Loading v-if="loading" />
    <PrognoAlert
      v-else-if="notFound"
      variant="danger"
    >
      {{ notFoundText }}
    </PrognoAlert>
    <PCard v-else-if="variant === 'card'">
      <slot />
    </PCard>
    <slot v-else />
  </PContainer>
</template>

<script setup lang="ts">
import {computed, watchEffect, onBeforeUnmount} from "vue";
import {useRoute} from "vue-router";
import PContainer from "@/components/lib/PContainer.vue";
import PTitle from "@/components/lib/PTitle.vue";
import PCard from "@/components/lib/PCard.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import Loading from "@/components/lib/Loading.vue";
import Breadcrumb from "@/components/lib/Breadcrumb.vue";
import useBreadcrumbs from "@/composables/useBreadcrumbs";
import {usePageStore} from "@/store/pageStore";

interface Props {
  title?: string;
  subtitle?: string;
  /** `card`: el contenido va dentro de una PCard. `plain`: la vista pone sus propias cards */
  variant?: 'card' | 'plain';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  loading?: boolean;
  /** `true` o el mensaje a mostrar cuando el recurso no existe */
  notFound?: boolean | string;
  breadcrumb?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  subtitle: undefined,
  variant: 'card',
  size: 'full',
  loading: false,
  notFound: false,
  breadcrumb: true
});

const route = useRoute();
const pageStore = usePageStore();
const {parent} = useBreadcrumbs();

const heading = computed(() => props.title ?? route.meta.title);
const notFoundText = computed(() => typeof props.notFound === 'string' ? props.notFound : 'No se ha encontrado lo que buscabas');

// Sincroniza el título dinámico con el breadcrumb y document.title
watchEffect(() => {
  pageStore.title = props.title;
});
onBeforeUnmount(() => {
  pageStore.title = undefined;
});
</script>
