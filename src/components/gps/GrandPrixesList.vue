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

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import GrandPrixPreview from "@/components/gps/GrandPrixPreview.vue";
    import {GrandPrix} from "@/types/GrandPrix";
    import {Season} from "@/types/Season";
    import {Competition} from "@/types/Competition";
    import {GrandPrixesModule} from "@/_store/modules/GrandPrixesModule";

    @Component({
        components: {GrandPrixPreview},
    })
    export default class GrandPrixesList extends Vue {
        /*private isLoadingGps: boolean = GrandPrixesModule.isLoadingGrandPrixesList;
        private gpList: Array<GrandPrix> = GrandPrixesModule.gpList;*/
        @Prop() searchType!: string;
        @Prop() competition!: Competition;
        @Prop() season!: Season;

        mounted() {
            //GrandPrixesModule.fetchGrandPrixesList({competition: this.competition, season: this.season, searchType: this.searchType});
        }
    }
</script>