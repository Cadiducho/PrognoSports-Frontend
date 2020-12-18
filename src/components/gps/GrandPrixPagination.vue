<template>
    <div id="gpPaginationComponent">
        <nav class="pagination is-centered" role="navigation" aria-label="pagination">
            <a v-if="thereIsPrevious(grandPrix)" class="pagination-previous" @click="push(false)">&laquo;</a>
            <a v-if="thereIsNext(grandPrix)" class="pagination-next" @click="push(true)">&raquo;</a>
            <ul class="pagination-list">
                <li><span v-if="thereIsPrevious(grandPrix)" class="pagination-ellipsis">&hellip;</span></li>
                <li><a class="pagination-link is-current">{{grandPrix.code}} ({{grandPrix.round}}º)</a></li>
                <li><span v-if="thereIsNext(grandPrix)" class="pagination-ellipsis">&hellip;</span></li>
            </ul>
        </nav>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import {GrandPrix} from "@/types/GrandPrix";
    import {Competition} from "@/types/Competition";
    import {RawLocation} from "vue-router";

    @Component
    export default class GrandPrixPagination extends Vue {
        @Prop({required: true}) private competition!: Competition;
        @Prop({required: true}) private grandPrix!: GrandPrix;

        private thereIsPrevious(grandPrix: GrandPrix): boolean {
            return grandPrix.round > 1;
        }

        private thereIsNext(grandPrix: GrandPrix): boolean {
            return (grandPrix.round + 1) <= grandPrix.season.totalEvents;
        }

        push(next: boolean): void {
            let params: RawLocation = {
                name: 'gpdetails',
                params: {
                    id: ((this.grandPrix.round + (next ? 1 : -1)).toString())
                }
            };
            this.$router.push(params);
        }
    }
</script>
