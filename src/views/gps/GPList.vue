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

<script>

    import PrognoPageTitle from "@/components/lib/PrognoPageTitle";
    import NextGrandPrix from "@/components/gps/NextGrandPrix";
    import GrandPrixesList from "@/components/gps/GrandPrixesList";

    export default {
        components: {
            GrandPrixesList,
            NextGrandPrix,
            PrognoPageTitle
        },
        name: "GPList",
        data() {
            return {
                breadcumbItems: [
                    {
                        text: 'Inicio',
                        to: '/home'
                    },
                    {
                        text: 'Grandes Premios',
                        active: true
                    },
                ],
            }
        }
    }
</script>