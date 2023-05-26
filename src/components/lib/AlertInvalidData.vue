<template>
    <o-notification v-if="object == undefined || object.toString().trim() === ''" variant="danger" aria-close-label="Close notification" role="alert">
        {{ message }}
    </o-notification>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: "LandingNavbar",
    props: {
        object: {
            type: Object,
            required: false,
        },
        message: {
            type: String,
            required: true
        }
    }
});
</script>