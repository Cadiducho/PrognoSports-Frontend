<template>
    <div id="gpPaginationComponent">
        <nav class="pagination is-centered" role="navigation" aria-label="pagination">
            <a v-if="thereIsPrevious(grandPrix)" class="pagination-previous" @click="push(false)">&laquo;</a>
            <a v-if="thereIsNext(grandPrix)" class="pagination-next" @click="push(true)">&raquo;</a>
            <ul class="pagination-list">
                <li><a class="pagination-link is-current">{{grandPrix.code}} ({{grandPrix.round}}º)</a></li>
            </ul>
        </nav>
    </div>
</template>

<script lang="ts">
    import {GrandPrix} from "@/types/GrandPrix";
    import {Competition} from "@/types/Competition";
    import {RouteLocationRaw} from "vue-router";

    import {defineComponent, PropType} from "vue";
    import {useAuthStore} from "@/store/authStore";
    import {useCommunityStore} from "@/store/communityStore";

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
            },
            isAdminPag: {
                type: Boolean,
                required: false,
            }
        },
        setup() {
            const authStore = useAuthStore();
            const communityStore = useCommunityStore();

            const currentUser = authStore.loggedUser;
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
                let params: RouteLocationRaw = {
                    name: this.isAdminPag ? 'adminGpEdit' : 'gpdetails',
                    params: {
                        competition: this.grandPrix.competition.code,
                        season: this.grandPrix.season.name,
                        id: ((this.grandPrix.round + (next ? 1 : -1)).toString())
                    }
                };
                this.$router.push(params);
            }
        }
    });
</script>
