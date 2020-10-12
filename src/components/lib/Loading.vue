<template>
    <div id="loadingComponent" >
        <progress class="progress is-primary" max="100">%</progress>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component'

    @Component
    export default class Loading extends Vue {
    }
</script>