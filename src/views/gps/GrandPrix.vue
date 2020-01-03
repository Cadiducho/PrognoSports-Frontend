<template>
    <div id="grandprix" class="container-fluid">
        <div v-if="isLoadingGrandPrix || grandPrix === undefined">
            <loading />
        </div>
        <div v-else>
            <b-breadcrumb :items="breadcumbItems"></b-breadcrumb>

            <b-row>
                <b-col sm="9">
                    <PrognoPageTitle :name="grandPrix.name + ' de ' + grandPrix.season" />
                </b-col>
                <b-col sm="3">
                    <GrandPrixPagination :grand-prix="grandPrix"/>
                </b-col>
            </b-row>

            <b-row>
                <div v-bind:class="[startGrid !== undefined ? 'col-sm-6' : '', 'col-sm-9']">
                    <b-card class="mb-grid">
                        <b-card-header>
                            Header
                        </b-card-header>
                        <b-card-body>
                            Un gp de {{ grandPrix.code }}
                                {{ JSON.stringify(grandPrix)}}
                        </b-card-body>
                    </b-card>
                </div>
                <b-col v-if="startGrid !== undefined" sm="3">
                    <StartGrid />
                </b-col>
                <b-col sm="3">
                    <CircuitCard :circuit="grandPrix.circuit" :laps="grandPrix.laps" />
                </b-col>
            </b-row>
        </div>
    </div>
</template>

<script>
    import store from "@/_store";
    import {FETCH_GRAND_PRIX} from "@/_store/actions.type";
    import {mapGetters} from "vuex";
    import PrognoPageTitle from "@/components/lib/PrognoPageTitle";
    import GrandPrixPagination from "@/components/gps/GrandPrixPagination";
    import CircuitCard from "@/components/gps/CircuitCard";
    import StartGrid from "@/components/gps/StartGrid";

    export default {
        name: "GrandPrix",
        components: {
            CircuitCard,
            PrognoPageTitle,
            GrandPrixPagination,
            StartGrid
        },
        data() {
            return {
                breadcumbItems: [
                    {
                        text: 'Inicio',
                        to: '/home'
                    },
                    {
                        text: 'Grandes Premios',
                        to: '/gps'
                    },
                    {
                        text: this.$route.params.id,
                        active: true
                    }
                ],
            }
        },
        beforeRouteEnter(to, from, next) {
            let payload = {'season': to.params.season, 'id': to.params.id};
            store.dispatch(FETCH_GRAND_PRIX, payload).then(next());
        },
        computed: {
            ...mapGetters(["isLoadingGrandPrix", "grandPrix", "startGrid"])
        },
    }
</script>

<style scoped>

</style>