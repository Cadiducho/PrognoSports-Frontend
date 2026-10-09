<template>
  <nav
    class="text-base font-medium text-gray-700 dark:text-gray-200"
    aria-label="breadcrumbs"
  >
    <ol class="flex flex-wrap items-center gap-x-2.5 gap-y-1">
      <li>
        <router-link
          class="inline-flex items-center rounded p-1 text-gray-500 transition hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
          :to="{name: 'home'}"
          aria-label="Inicio"
          title="Inicio"
        >
          <i class="fas fa-house" />
        </router-link>
      </li>

      <li
        v-for="crumb in crumbs"
        :key="crumb.title"
        class="flex items-center gap-2.5"
      >
        <i class="fas fa-chevron-right text-xs text-gray-400 dark:text-gray-500" />
        <span
          v-if="crumb.isLast"
          class="font-semibold text-gray-900 dark:text-white"
          aria-current="page"
        >
          {{ crumb.title }}
        </span>
        <router-link
          v-else
          class="transition hover:text-brand-500 hover:underline dark:hover:text-brand-400"
          :to="crumb.to"
        >
          {{ crumb.title }}
        </router-link>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import useBreadcrumbs from "@/composables/useBreadcrumbs";

const {crumbs} = useBreadcrumbs();
</script>
