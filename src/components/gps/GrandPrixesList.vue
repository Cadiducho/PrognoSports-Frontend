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
    import {namespace, State} from 'vuex-class'
    const grandprix = namespace('grandprix');

    import GrandPrixPreview from "@/components/gps/GrandPrixPreview.vue";
    import {GrandPrix} from "@/types/GrandPrix";
    import GrandPrixesTypes from "@/_store/types/GrandPrixesTypes";

    @Component({
        components: {GrandPrixPreview}
    })
    export default class GrandPrixesList extends Vue {
        @grandprix.Getter isLoadingGps!: boolean;
        @grandprix.Getter gpList!: Array<GrandPrix>;
        @Prop() searchType!: string;
        @grandprix.Action(GrandPrixesTypes.actions.FETCH_GP_LIST) fetchListAction!: (searchType: string) => void;

        mounted() {
            this.fetchListAction(this.searchType);
        }
    }
</script>