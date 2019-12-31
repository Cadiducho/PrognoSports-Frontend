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

<script>

    import moment from "moment-timezone";
    import {mapState} from "vuex";

    export default {
        name: "GrandPrixPreview",
        props: {
            gp: { type: Object, required: true }
        },
        computed: {
            gpLink() {
                return {
                    name: "gpdetails",
                    params: {
                        season: this.gp.season,
                        id: this.gp.id,
                    }
                };
            },
            ...mapState({
                profile: state => state.user.profile,
            })
        },
        methods: {
            humanDate(date) {
                return moment(String(date)).tz(this.profile.preferences['time-zone-id']).format('DD/MM/YYYY HH:mm:ss');
            },
            timeLeft(date) {
                return moment(String(date)).tz(this.profile.preferences['time-zone-id']).fromNow();
            }
        }
    }
</script>

<style scoped>

</style>