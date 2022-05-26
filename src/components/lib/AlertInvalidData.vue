<template>
    <o-notification v-if="object == undefined" variant="danger" aria-close-label="Close notification" role="alert">
        {{ message }}
    </o-notification>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import {Prop} from "vue-property-decorator";

@Component
export default class AlertInvalidData extends Vue {
    @Prop({required: false}) object!: any | undefined;
    @Prop({required: true}) message!: string;
}
</script>