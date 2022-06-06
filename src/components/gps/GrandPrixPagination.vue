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
    import {GrandPrix} from "@/types/GrandPrix";
    import {Competition} from "@/types/Competition";
    import {RawLocation} from "vue-router";

    import {defineComponent, PropType} from "vue";
    import {useAuthStore} from "@/pinia/authStore";
    import {useCommunityStore} from "@/pinia/communityStore";

    export default defineComponent({
        name: "GrandPrixPagination",
        props: {
            competition: {
                type: Object as PropType<Competition>,
                required: true,
            },
            grandPrix: {
                type: Object as PropType<GrandPrix>,
                required: true,
            }
        },
        setup() {
            const authStore = useAuthStore();
            const communityStore = useCommunityStore();

            const currentUser = authStore.user;
            const currentCommunity = communityStore.community;
            return { currentUser, currentCommunity };
        },
        methods: {
            thereIsPrevious(grandPrix: GrandPrix): boolean {
                return grandPrix.round > 1;
            },
            thereIsNext(grandPrix: GrandPrix): boolean {
                return (grandPrix.round + 1) <= grandPrix.season.totalEvents;
            },
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
    });
</script>
