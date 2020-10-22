<template>
    <div class="card">
        <div class="card-image">
            <img v-if="circuit.logo_url !== undefined && circuit.logo_url.length > 0" class="card-img-top" :src="circuit.logo_url" alt="Logo image">
            <img class="card-img-top" :src="circuit.variant.layout_image" alt="Circuit layout image">
        </div>
        <div class="content">
            <h5 class="title font-weight-bold">{{circuit.name}}</h5>
            <p class="subtitle"><b>Location </b>{{circuit.locality}}, {{circuit.country}}</p>
            <p class="card-text"><b>Distance per lap </b>{{circuit.variant.distance}} km</p>
            <p v-if="hasLaps" class="card-text"><b>Laps </b>{{laps}}</p>
            <p v-if="hasLaps" class="card-text"><b>Total distance </b>{{laps * circuit.variant.distance}} km</p>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import {Circuit} from "../../types/Circuit";

    @Component
    export default class CircuitCard extends Vue {
        @Prop({required: true}) private circuit!: Circuit;
        @Prop() private laps!: number;

        public hasLaps() {
            return this.laps != undefined || this.laps != 0;
        }
    }
</script>