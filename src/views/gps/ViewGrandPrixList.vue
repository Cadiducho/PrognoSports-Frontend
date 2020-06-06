<template>
    <div id="gplist" class="container-fluid">
        <b-breadcrumb :items="breadcumbItems"></b-breadcrumb>

        <progno-page-title name="Grandes Premios" />
           <b-row>
               <b-col md="8">
                   <b-tabs content-class="mt-3">
                       <b-tab title="Próximos" active>
                           <GrandPrixesList :competition="competition" :season="season" searchType="next"/>
                       </b-tab>
                       <b-tab title="Pasados">
                           <GrandPrixesList :competition="competition" :season="season" searchType="past"/>
                       </b-tab>
                       <b-tab title="Todos">
                           <GrandPrixesList :competition="competition" :season="season" searchType="all"/>
                       </b-tab>
                   </b-tabs>
                </b-col>
                <b-col md="4">
                    <NextGrandPrix :competition="competition" />
                </b-col>
            </b-row>
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
        breadcumbItems = [
            {
                text: 'Inicio',
                to: '/home'
            },
            {
                text: 'Grandes Premios',
                active: true
            },
        ];
        competition!: Competition;
        season!: Season;

        created() {
            this.competition = { code: this.$route.params.competition } as Competition;
            this.season = { name: this.$route.params.season } as Season;

            if (this.season.name === undefined) { //empty
                // ToDo: Mostrar la season más reciente
                console.log("Undef");
            }
        }

    }
</script>