<template>
    <b-notification type="is-danger" aria-close-label="Close notification" role="alert">
        No tienes permiso para visualizar esta página
    </b-notification>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import {Prop} from "vue-property-decorator";

@Component
export default class AlertNoPermission extends Vue {
}
</script>