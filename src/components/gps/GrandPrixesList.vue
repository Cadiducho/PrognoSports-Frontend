<template>
    <div id="gpListComponent">
        <div v-if="isLoadingGps || gpList === undefined"><loading /></div>
        <div v-else>
            <div v-if="gpList.length === 0">
                No hay grandes premios aquí... de momento
            </div>
            <GrandPrixPreview
                    v-for="(grandprix, index) in gpList"
                    :gp="grandprix"
                    :key="grandprix.name + index"
            />
        </div>
    </div>
</template>

<script>
    import GrandPrixPreview from "@/components/gps/GrandPrixPreview";
    import {mapGetters} from "vuex";
    import {FETCH_GP_LIST} from "@/_store/actions.type";

    export default {
        name: "GrandPrixesList",
        components: {GrandPrixPreview},
        props: {
            searchType: { type: String, default: 'all' }
        },
        computed: {
            ...mapGetters(["isLoadingGps", "gpList"])
        },
        mounted() {
            this.fetchGPList();
        },
        methods: {
            fetchGPList() {
                this.$store.dispatch(FETCH_GP_LIST, this.searchType);
            }
        }
    }
</script>