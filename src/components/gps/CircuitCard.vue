<template>
    <div class="card">
        <div class="card-image">
            <figure class="image">
                <img v-if="circuit.logo_url !== undefined && circuit.logo_url.length > 0" class="card-img-top" :src="circuit.logo_url" alt="Logo image">
            </figure>
            <figure class="image">
                <img class="card-img-top" :src="circuit.variant.layout_image" alt="Circuit layout image">
            </figure>
        </div>
        <div class="card-content">
            <div class="media">
                <div class="media-content">
                    <p class="title is-4">{{circuit.name}} {{ circuit.hasVariant ? ('-' + circuit.variant.name) : ""}}</p>
                    <p class="subtitle is-6">{{circuit.locality}}, {{circuit.country}}</p>
                </div>
            </div>

            <div class="content">
                <p v-if="circuit.hasVariant" class="card-text"><b>Variante: </b>{{circuit.variant.name}}</p>
                <p class="card-text"><b>Distancia por vuelta: </b>{{circuit.variant.distance}} km</p>
                <p v-if="hasLaps()" class="card-text"><b>Vueltas: </b>{{laps}}</p>
                <p v-if="hasLaps()" class="card-text"><b>Distancia total: </b>{{laps * circuit.variant.distance}} km</p>
            </div>
            <b-button type="is-info is-light is-fullwidth" tag="router-link" :to="circuitUrl">Más datos del circuito</b-button>
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

        public hasLaps(): boolean {
            return this.laps != undefined || this.laps != 0;
        }

        get circuitUrl(): string {
            let variant = this.circuit.hasVariant ? ('/ '+ this.circuit!.variant) : "";
            return '/circuits/' + this.circuit!.id + variant;
        }
    }
</script>