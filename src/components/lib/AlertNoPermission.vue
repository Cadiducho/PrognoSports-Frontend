<template>
    <o-notification variant="danger" aria-close-label="Close notification" role="alert">
        No tienes permiso para visualizar esta página
    </o-notification>
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
    name: "AlertNoPermission"
});
</script>