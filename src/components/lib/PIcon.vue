<template>
  <i :class="['i', iconClass]" />
</template>

<script setup lang="ts">
import {computed} from "vue";

const props = withDefaults(defineProps<{
  icon?: string;
}>(), {
  icon: 'fa fa-question-circle'
});
const iconClass = computed(() => props.icon);

</script>
