<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="md:col-span-2">
      <PTitle :name="`${isAdminText}${props.grandPrix.name} de ${grandPrix.season.name}`" />
    </div>
    <div class="md:col-span-1">
      <GrandPrixPagination
        :is-admin-pag="isAdmin"
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
import {computed, PropType} from "vue";

const props = defineProps({
  grandPrix: { type: Object as PropType<GrandPrix>, required: true },
  competition: { type: Object as PropType<Competition>, required: true },
  isAdmin: { type: Boolean, required: false, default: false }
})

const isAdminText = computed(() => {
  return props.isAdmin ? 'Administración de ' : '';
})
</script>
