<template>
    <div>
        <h1 class="title mb-3">{{ name }}</h1>
    </div>
</template>

<script lang="ts">
    import {defineComponent} from "@vue/composition-api";

    export default defineComponent({
        name: "PrognoPageTitle",
        props: {
            title: String,
        }
    });
</script>