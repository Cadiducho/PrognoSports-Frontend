<template>
    <div id="loadingComponent">
        <progress class="progress is-primary" max="100">%</progress>
    </div>
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
    name: "Loading"
});
</script>