<template>
  <div
    v-show="show"
    class="fixed bottom-16 right-2 z-40 p-4 md:bottom-0 md:right-16"
  >
    <PTooltip
      label="Volver arriba"
      placement="left"
      @click="scrollToTop"
    >
      <PButton pilled>
        <PIcon icon="fas fa-angle-up" />
      </PButton>
    </PTooltip>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import PTooltip from "@/components/lib/PTooltip.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PIcon from "@/components/lib/PIcon.vue";

const props = defineProps<{
    scrollY: number
}>();

const show = ref(false);

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

onMounted(() => {
    window.addEventListener("scroll", (e) => {
        show.value = window.scrollY > props.scrollY;
    });
});
</script>
