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
                        <img :src="circuitLogoImage(gp.circuit)" alt="Circuit logo">
                    </figure>
                </div>
            </div>
            <p class="content block">
                <span v-for="session in gp.sessions">
                    {{ session.humanName() }}: {{ session.date | humanDate }} ({{ session.date | dateDiff }}) <br />
                </span>
            </p>
            <footer class="card-footer">
                <o-button tag="router-link"
                          :to="gpLink"
                          variant="info is-light" expanded>
                    Pronosticar
                </o-button>
            </footer>
        </article>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Vue} from "vue-property-decorator";
    import {GrandPrix} from "@/types/GrandPrix";
    import {Circuit} from "@/types/Circuit";

    @Component
    export default class GrandPrixPreview extends Vue {
        @Prop({required: true}) gp!: GrandPrix;

        get gpLink(): Object {
            return {
                name: "gpdetails",
                params: {
                    competition: this.gp.competition.code,
                    season: this.gp.season.name,
                    id: this.gp.id,
                }
            };
        }

        public circuitLogoImage(circuit: Circuit) {
            return circuit?.logo_url ?? import('@/assets/default_profile_image.jpg');
        }
    }
</script>