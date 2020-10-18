<template>
    <div>
        <article class="tile is-child box">
            <p class="title">{{gp.name}} de {{gp.season.name}}</p>
            <p class="subtitle">{{gp.circuit.name}}, {{gp.circuit.locality}} ({{gp.circuit.country}})</p>
            <p class="content block">
                <!--Clasificación: {{humanDate(gp.qualiTime)}} ({{timeLeft(gp.qualiTime)}}) <br>
                    Carrera: {{humanDate(gp.raceTime)}} ({{timeLeft(gp.raceTime)}})-->
                Tiempos y horas
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
    import moment from "moment-timezone";
    import {GrandPrix} from "@/types/GrandPrix";
    import {User} from "@/types/User";
    import {UserModule} from "@/_store/modules/UserModule";

    @Component
    export default class GrandPrixPreview extends Vue {
        @Prop({required: true}) gp!: GrandPrix;
        private profile: User = UserModule.profile;

        get gpLink(): Object {
            return {
                name: "gpdetails",
                params: {
                    season: this.gp.season.name,
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