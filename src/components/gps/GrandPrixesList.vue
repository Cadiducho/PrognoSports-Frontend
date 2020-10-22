<template>
    <div id="gpListComponent">
        <div v-if="isLoading"><loading /></div>
        <div v-else>
            <div v-if="gps.length === 0">
                No hay grandes premios aquí... de momento
            </div>
            <GrandPrixPreview
                    v-for="(grandprix, index) in gps"
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
    import {grandPrixService} from "@/_services";

    @Component({
        components: {GrandPrixPreview},
    })
    export default class GrandPrixesList extends Vue {
        @Prop() searchType!: string;
        @Prop() competition!: Competition;
        @Prop() season!: Season;
        private isLoading: boolean = true;
        private gps: Array<GrandPrix> = [];

        mounted() {
            grandPrixService.getGrandPrixesList(this.searchType, this.competition, this.season).then((list) => {
                this.gps.push(...list);
                this.isLoading = false;
            });
        }
    }
</script>