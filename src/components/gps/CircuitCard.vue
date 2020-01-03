<template>
    <b-card class="mb-3">
        <img v-if="circuit.logo_url !== undefined" class="card-img-top" :src="circuit.logo_url" alt="Logo image">
        <img class="card-img-top" :src="circuit.image_url" alt="Circuit image">
        <b-card-body>
            <h5 class="card-title font-weight-bold">{{circuit.name}}</h5>
            <p class="card-text"><b>Location </b>{{circuit.locality}}, {{circuit.country}}</p>
            <p class="card-text"><b>Distance per lap </b>{{circuit.distance}} km</p>
            <p v-if="hasLaps" class="card-text"><b>Laps </b>{{laps}}</p>
            <p v-if="hasLaps" class="card-text"><b>Total distance </b>{{laps * circuit.distance}} km</p>
        </b-card-body>
    </b-card>
</template>

<script>
    export default {
        name: "CircuitCard",
        props: {
            circuit: {type: Object, required: true},
            laps: {type: Number}
        },
        methods: {
            hasLaps() {
                return this.laps !== undefined || this.laps != 0;
            }
        }
    }
</script>