<template>
  <div :class="[tableWrapperClass, 'bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-200']">
    <table :class="tableClass">
      <thead :class="[theadClass, '[&_th]:whitespace-nowrap [&_th]:border-b [&_th]:border-gray-200 [&_th]:px-3 [&_th]:py-2.5 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-gray-600 dark:[&_th]:border-gray-700 dark:[&_th]:text-gray-300']">
        <slot name="head" />
      </thead>
      <tbody class="[&>tr:nth-child(even)]:bg-gray-50 dark:[&>tr:nth-child(even)]:bg-gray-800/50 [&_td]:border-b [&_td]:border-gray-100 [&_td]:px-3 [&_td]:py-2 dark:[&_td]:border-gray-800 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left">
        <slot />
      </tbody>
      <tfoot
        v-if="$slots.foot"
        class="bg-gray-100 font-semibold dark:bg-gray-800 [&_td]:px-3 [&_td]:py-2 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left"
      >
        <slot name="foot" />
      </tfoot>
    </table>
  </div>
</template>

<script setup lang="ts">
import {tableClass, tableWrapperClass, theadClass} from "@/components/lib/table/styles";
</script>
