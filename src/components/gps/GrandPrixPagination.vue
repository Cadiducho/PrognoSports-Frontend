<template>
    <div id="gpPaginationComponent">
        <ul class="pagination justify-content-sm-end">
            <div v-if="grandPrix.round < 1">
                <li class="page-item disabled">
                    <a class="page-link" aria-label="Previo">
                        <span aria-hidden="true">&times;</span>
                    </a>
                </li>
            </div>
            <div v-else>
                <li class="page-item">
                    <router-link class="page-link" :to="'/gps/' + grandPrix.season + '/' + (grandPrix.round - 1)" aria-label="Previo">
                        <span aria-hidden="true">&laquo;</span>
                    </router-link>
                </li>
            </div>
            <li class="page-item disabled">
                <a class="page-link" href="#" tabindex="-1" aria-disabled="true">{{grandPrix.code}} ({{grandPrix.round}}º)</a>
            </li>
            <div v-if="(grandPrix.round + 1) > 21">
                <li class="page-item disabled">
                    <a class="page-link" aria-label="Siguiente">
                        <span aria-hidden="true">&times;</span>
                    </a>
                </li>
            </div>
            <div v-else>
                <li class="page-item">
                    <a class="page-link" :href="'/gps/' + grandPrix.season + '/' + (grandPrix.round + 1)" aria-label="Siguiente">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </div>
        </ul>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import {GrandPrix} from "../../types/GrandPrix";

    @Component
    export default class GrandPrixPagination extends Vue {
        @Prop({required: true}) private grandPrix!: GrandPrix;
    }
</script>
