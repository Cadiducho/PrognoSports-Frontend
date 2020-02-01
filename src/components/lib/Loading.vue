<template>
    <div id="loadingComponent" class="text-center">
        <div class="spinner-grow text-info" role="status">
            <span class="sr-only">Loading...</span>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component'

    @Component
    export default class Loading extends Vue {
    }
</script>