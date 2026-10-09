<template>
  <section class="mb-3">
    <div class="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center">
      <PButton
        class="shrink-0"
        :color="color"
        icon="fa fa-sort"
        @click="open = !open"
      >
        Ordenar
      </PButton>
      <PInput
        v-model="search"
        class="flex-1"
        :placeholder="placeholder"
        icon="fa fa-search"
        type="search"
        no-margin
      />
    </div>
    <PCollapse :open="open">
      <PCard
        class="mt-1"
        padding="sm"
      >
        <slot name="options" />
      </PCard>
    </PCollapse>
  </section>
</template>

<script setup lang="ts">
import PButton from "@/components/lib/forms/PButton.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import PCollapse from "@/components/lib/PCollapse.vue";
import PCard from "@/components/lib/PCard.vue";

const search = defineModel<string>({default: ''});
const open = defineModel<boolean>('open', {default: false});

withDefaults(defineProps<{
  placeholder?: string;
  color?: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'teal';
}>(), {
  placeholder: 'Buscar...',
  color: 'info'
});

</script>
