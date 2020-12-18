<template>
    <div id="grandprix" class="box">
        <div v-if="isLoadingGrandPrix || grandPrix === undefined">
            <loading />
        </div>
        <div v-else>
            <div class="columns is-variable is-5">
                <div class="column">
                    <PrognoPageTitle :name="grandPrix.name + ' de ' + grandPrix.season.name" />
                </div>
                <div class="column is-3">
                    <GrandPrixPagination :competition="competition" :grand-prix="grandPrix"/>
                </div>
            </div>

            <div class="columns">
                <div v-bind:class="thereIsGrid ? 'column is-6' : 'column is-9'">
                    <b-tabs v-model="activeTab">
                        <b-tab-item label="Clasificación">
                            <h6 class="font-weight-light">La hora de cierre de este pronóstico para la <strong>clasificación</strong> es {{grandPrix.qualiTime | humanDateMinusFiveMinutes}}</h6>
                            <SelectTipps session="QUALIFY" :grand-prix="grandPrix"/>
                        </b-tab-item>
                        <b-tab-item label="Carrera">
                            <h6 class="font-weight-light">La hora de cierre de este pronóstico para la <strong>carrera</strong> es {{grandPrix.raceTime | humanDateMinusFiveMinutes}}</h6>
                            <SelectTipps session="RACE" :grand-prix="grandPrix"/>
                        </b-tab-item>
                    </b-tabs>
                </div>
                <div v-if="thereIsGrid" class="content column">
                    <StartGrid :grid="startGrid"/>
                </div>
                <div class="column is-3">
                    <CircuitCard :circuit="grandPrix.circuit" :laps="grandPrix.laps" />
                    <PitLaneStartGrid :grid="startGrid"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
    import GrandPrixPagination from "@/components/gps/GrandPrixPagination.vue";
    import CircuitCard from "@/components/gps/CircuitCard.vue";
    import StartGrid from "@/components/gps/StartGridList.vue";
    import {Component, Vue} from "vue-property-decorator";
    import {Competition} from "@/types/Competition";
    import {Season} from "@/types/Season";
    import {GrandPrix} from "@/types/GrandPrix";
    import {grandPrixService} from "@/_services";
    import {StartGridPosition} from "@/types/StartGridPosition";
    import SelectTipps from "@/components/gps/SelectTipps.vue";
    import PitLaneStartGrid from "@/components/gps/PitLaneStartGrid.vue";

    @Component({
        components: {
            PitLaneStartGrid,
            SelectTipps,
            CircuitCard,
            PrognoPageTitle,
            GrandPrixPagination,
            StartGrid
        }
    })
    export default class ViewOneGrandPrix extends Vue {

        private competition: Competition = { code: this.$route.params.competition } as Competition;
        private season: Season = {name: this.$route.params.season } as Season;
        private id: string = this.$route.params.id;

        private grandPrix?: GrandPrix;
        private isLoadingGrandPrix: boolean = true;
        private thereIsGrid: boolean = false;
        private startGrid: Array<StartGridPosition> = [];

        private activeTab: number = 0;

        mounted() {
            grandPrixService.getGrandPrix(this.competition, this.season, this.id)
                .then(gp => {
                    this.grandPrix = gp;
                    this.isLoadingGrandPrix = false;
                }).then(() => {
                    grandPrixService.getGrandPrixGrid(this.competition, this.season, this.id).then((grid) => {
                        this.startGrid.push(...grid);
                        if (this.startGrid.length !== 0) {
                            this.thereIsGrid = true;
                        }
                    })
                });

        }
    }
</script>