<template>
    <div>
        <h1 class="title mb-3">{{ name }}</h1>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: "PrognoPageTitle",
    props: {
        name: String,
    }
});
</script>

<style scoped lang="scss">
@use '@/scss/variables';

// Resolución móvil
@media screen and (max-width: variables.$desktop) {
    .title {
        font-size: 1.5rem;
    }
}
</style>