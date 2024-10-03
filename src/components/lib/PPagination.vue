<template>
  <div class="flex items-center justify-between border-t border-gray-200 dark:bg-gray-800 px-4 py-3 sm:px-6">
    <div class="flex flex-1 justify-between sm:hidden">
      <a
        href="#"
        class="relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200"
      >Previo</a>
      <a
        href="#"
        class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200"
      >Anterior</a>
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700 dark:text-gray-300">
          Mostrando de
          <span class="font-medium"> {{ ((current - 1) * perPage) + 1 }}</span>
          a
          <span class="font-medium">{{ maxElementInThisPage }}</span>
          de un total de
          <span class="font-medium">{{ total }}</span>
          resultados
        </p>
      </div>
      <div>
        <nav
          class="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <button
            :disabled="current === 1"
            :class="{'cursor-not-allowed bg-gray-200 !hover:bg-gray-200 dark:bg-gray-700 !hover:dark:bg-gray-700': (current === 1)}"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-slate-200 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0"
            @click="updatePage(current - 1)"
          >
            <span class="sr-only">Anterior</span>
            <svg
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          <button
            v-for="page in pagesInRange"
            :key="page"
            :class="getButtonClasses(page)"
            @click="updatePage(page)"
          >
            {{ page }}
          </button>

          <button
            :disabled="current === pageCount"
            :class="{'cursor-not-allowed bg-gray-200 !hover:bg-gray-200 dark:bg-gray-700 dark:ring-gray-600': (current === pageCount)}"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-slate-200 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0"
            @click="updatePage(current + 1)"
          >
            <span class="sr-only">Siguiente</span>
            <svg
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'PPagination',
  props: {
    total: {
      type: Number,
      required: true
    },
    perPage: {
      type: Number,
      required: true
    },
    initialCurrent: {
      type: Number,
      default: 1
    },
    /** Number of pagination items to show before current page */
    rangeBefore: {
      type: Number,
      default: 1
    },
    /** Number of pagination items to show after current page */
    rangeAfter: {
      type: Number,
      default: 1
    },
  },
  emits: ['update:currentPage'],
  data() {
    return {
      current: this.initialCurrent
    }
  },
  computed: {
    /**
     * Total page size (count).
     */
    pageCount() {
      return Math.ceil(this.total / this.perPage)
    },

    /**
     * First item of the page (count).
     */
    firstItem() {
      const firstItem = this.current * this.perPage - this.perPage + 1
      return firstItem >= 0 ? firstItem : 0
    },

    /**
     * Check if previous button is available.
     */
    hasPrev() {
      return this.current > 1
    },

    /**
     * Check if next button is available.
     */
    hasNext() {
      return this.current < this.pageCount
    },

    /**
     * Get near pages, 1 before and 1 after the current
     */
    pagesInRange() {
      let left = Math.max(1, this.current - this.rangeBefore)
      if (left - 1 === 2) {
        left-- // Do not show the ellipsis if there is only one to hide
      }
      let right = Math.min(this.current + this.rangeAfter, this.pageCount)
      if (this.pageCount - right === 2) {
        right++ // Do not show the ellipsis if there is only one to hide
      }

      const pages = []
      for (let i = left; i <= right; i++) {
        pages.push(i);
      }
      return pages
    },
    /**
     *
     */
    maxElementInThisPage() {
      return Math.min(this.current * this.perPage, this.total)
    }
  },
  methods: {
    updatePage(page: number) {
      this.current = page;
      this.$emit('update:currentPage', page)
    },
    getButtonClasses(page: number) {
      const base = "relative inline-flex items-center px-4 py-2 text-sm font-semibold ";
      if (page === this.current) {
        return base + "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      } else {
        return base + "text-gray-900 dark:text-gray-300 ring-1 ring-inset ring-gray-300 hover:bg-slate-200 focus:outline-offset-0 dark:hover:bg-gray-700 dark:ring-gray-700 dark:focus:outline-offset-0";
      }
    }
  }
});
</script>
