<template>
  <figure
    :class="['group relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800', aspect === 'video' ? 'aspect-video' : 'aspect-square']"
  >
    <img
      :src="src"
      :alt="alt"
      class="h-full w-full object-cover"
    >
    <label
      class="absolute inset-0 grid cursor-pointer place-items-center bg-black/0 transition focus-within:bg-black/30 hover:bg-black/30"
      :title="label"
    >
      <span class="grid h-14 w-14 place-items-center rounded-full bg-brand-600 text-xl text-white opacity-85 transition group-hover:bg-brand-700 group-hover:opacity-100">
        <i class="fa fa-camera" />
      </span>
      <span class="sr-only">{{ label }}</span>
      <input
        accept="image/*"
        tabindex="-1"
        type="file"
        hidden
        @change="onChange"
      >
    </label>
  </figure>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  src: string;
  alt?: string;
  label?: string;
  aspect?: 'square' | 'video';
}>(), {
  alt: 'Imagen',
  label: 'Cambiar imagen',
  aspect: 'square'
});
const emit = defineEmits<{ select: [file: File] }>();

const onChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) emit('select', file);
  // Permite volver a elegir el mismo archivo
  input.value = '';
};
</script>
