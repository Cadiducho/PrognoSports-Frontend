<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="md:col-span-2">
      <PTitle :name="'Administración de ' + props.grandPrix.name + ' de ' + grandPrix.season.name" />
    </div>
    <div class="md:col-span-1">
      <GrandPrixPagination
        is-admin-pag
        :competition="props.competition"
        :grand-prix="props.grandPrix"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import GrandPrixPagination from "@/components/gps/GrandPrixPagination.vue";
import {GrandPrix} from "@/types/GrandPrix";
import {Competition} from "@/types/Competition";

const props = defineProps({
  grandPrix: { type: GrandPrix, required: true },
  competition: { type: Competition, required: true },
})
</script>
