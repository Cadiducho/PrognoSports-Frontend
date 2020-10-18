<template>
    <div id="gplist" class="box">

        <progno-page-title name="Grandes Premios" />

        <div class="columns is-variable is-5">
            <div class="column is-8">
                <b-tabs v-model="activeTab">
                    <b-tab-item label="Próximos">
                        <GrandPrixesList :competition="competition" :season="season" searchType="next"/>
                    </b-tab-item>

                    <b-tab-item label="Pasados">
                        <GrandPrixesList :competition="competition" :season="season" searchType="past"/>
                    </b-tab-item>

                    <b-tab-item label="Todos">
                        <GrandPrixesList :competition="competition" :season="season" searchType="all"/>
                    </b-tab-item>
                </b-tabs>
            </div>
            <div class="column is-4">
                <NextGrandPrix />
            </div>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Vue} from "vue-property-decorator";
    import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
    import NextGrandPrix from "@/components/gps/NextGrandPrix.vue";
    import GrandPrixesList from "@/components/gps/GrandPrixesList.vue";
    import {Competition} from "@/types/Competition";
    import {Season} from "@/types/Season";

    @Component({
        components: {
            GrandPrixesList,
            NextGrandPrix,
            PrognoPageTitle
        }
    })
    export default class ViewGrandPrixList extends Vue {

        private activeTab: number = 0;
        private competition!: Competition;
        private season!: Season;

        created() {
            this.competition = { code: this.$route.params.competition } as Competition;
            this.season = { name: this.$route.params.season } as Season;

            if (this.season.name === undefined) { //empty
                // ToDo: Obtener competicion y season por defecto si no está especificada
                //console.log("Season: ");
            }
        }

    }
</script>
