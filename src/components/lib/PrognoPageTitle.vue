<template>
    <div class="pb-3">
        <h1>{{ name }}</h1>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";

    @Component
    export default class PrognoPageTitle extends Vue {
        @Prop() private name!: string;
    }
</script>

<style scoped>

</style>