<template>
    <div id="gplist" class="container-fluid">
        <b-breadcrumb :items="breadcumbItems"></b-breadcrumb>

        <progno-page-title name="Grandes Premios" />

        <b-row>
            <b-col md="8">
                <b-tabs content-class="mt-3">
                    <b-tab title="Próximos" active>
                        <GrandPrixesList searchType="next"/>
                    </b-tab>
                    <b-tab title="Pasados">
                        <GrandPrixesList searchType="past"/>
                    </b-tab>
                    <b-tab title="Todos">
                        <GrandPrixesList searchType="all"/>
                    </b-tab>
                </b-tabs>
            </b-col>
            <b-col md="4">
                <next-grand-prix />
            </b-col>
        </b-row>
    </div>
</template>

<script lang="ts">

    import {Component, Vue} from "vue-property-decorator";
    import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
    import NextGrandPrix from "@/components/gps/NextGrandPrix.vue";
    import GrandPrixesList from "@/components/gps/GrandPrixesList.vue";

    @Component({
        components: {
            GrandPrixesList,
            NextGrandPrix,
            PrognoPageTitle
        }
    })
    export default class ViewGrandPrixList extends Vue {
        private breadcumbItems = [
            {
                text: 'Inicio',
                to: '/home'
            },
            {
                text: 'Grandes Premios',
                active: true
            },
        ];
    }
</script>