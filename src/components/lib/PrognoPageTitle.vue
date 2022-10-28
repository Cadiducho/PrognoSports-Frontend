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
@import "bulma/sass/utilities/_all.sass";

// Resolución móvil
@media screen and (max-width: $desktop) {
    .title {
        font-size: 1.5rem;
    }
}
</style>