<template>
    <b-notification v-if="object == undefined" type="is-danger" aria-close-label="Close notification" role="alert">
        {{ message }}
    </b-notification>
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