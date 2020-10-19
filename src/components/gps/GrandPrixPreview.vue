<template>
    <div>
        <article class="tile is-child box">
            <div class="media">
                <div class="media-content">
                    <p class="title is-4">{{gp.name}} de {{gp.season.name}}</p>
                    <p class="subtitle is-6">{{gp.circuit.name}}, {{gp.circuit.locality}} ({{gp.circuit.country}})</p>
                </div>
                <div class="media-right">
                    <figure class="image is-128x128">
                        <img :src="gp.circuit.logo_url" alt="Placeholder image">
                    </figure>
                </div>
            </div>
            <p class="content block">
                Clasificación: {{gp.qualiTime | humanDate }} ({{gp.qualiTime | dateDiff }}) <br>
                Carrera: {{gp.raceTime | humanDate}} ({{gp.raceTime | dateDiff }})
            </p>
            <footer class="card-footer">
                <b-button tag="router-link"
                          :to="gpLink"
                          type="is-info is-light" expanded>
                    Pronosticar
                </b-button>
            </footer>
        </article>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Vue} from "vue-property-decorator";
    import {GrandPrix} from "@/types/GrandPrix";

    @Component
    export default class GrandPrixPreview extends Vue {
        @Prop({required: true}) gp!: GrandPrix;

        get gpLink(): Object {
            return {
                name: "gpdetails",
                params: {
                    season: this.gp.season.name,
                    id: this.gp.id,
                },
            };
        }
    }
</script>