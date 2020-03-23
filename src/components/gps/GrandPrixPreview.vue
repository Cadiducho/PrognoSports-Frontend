<template>
    <div>
        <div class="card mb-2">
            <div class="card-body">
                <h5 class="card-title">{{gp.name}} de {{gp.season}}</h5>
                <h6 class="card-subtitle mb-2 text-muted">{{gp.circuit.name}}, {{gp.circuit.locality}} ({{gp.circuit.country}})</h6>
                <p class="card-text">
                    Clasificación: {{humanDate(gp.qualiTime)}} ({{timeLeft(gp.qualiTime)}}) <br>
                    Carrera: {{humanDate(gp.raceTime)}} ({{timeLeft(gp.raceTime)}})
                </p>
                <router-link :to="gpLink" class="card-link">Pronosticar</router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Vue} from "vue-property-decorator";
    import {namespace, State} from 'vuex-class'
    const grandprix = namespace('grandprix');

    import moment from "moment-timezone";
    import {GrandPrix} from "@/types/GrandPrix";
    import {User} from "@/types/User";

    @Component
    export default class GrandPrixPreview extends Vue {
        @Prop({required: true}) gp!: GrandPrix;
        @State(state => state.user.profile) profile!: User;

        get gpLink(): Object {
            return {
                name: "gpdetails",
                params: {
                    season: this.gp.season,
                    id: this.gp.id,
                },
            };
        }

        humanDate(date: any) {
            return moment(String(date)).tz(this.profile.preferences.get('time-zone-id')).format('DD/MM/YYYY HH:mm:ss');
        }
        timeLeft(date: any) {
            return moment(String(date)).tz(this.profile.preferences.get('time-zone-id')).fromNow();
        }
    }
</script>