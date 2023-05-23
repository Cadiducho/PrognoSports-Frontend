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
            const currentCommunity = communityStore.currentCommunity;
            return { currentUser, currentCommunity };
        },
        methods: {
            thereIsPrevious(grandPrix: GrandPrix): boolean {
                return !!grandPrix.previousGrandPrix.id;
            },
            thereIsNext(grandPrix: GrandPrix): boolean {
                return !!grandPrix.nextGrandPrix.id;
            },
            push(next: boolean): void {
                const params: RouteLocationRaw = {
                    name: this.isAdminPag ? 'adminGpEditInSeason' : 'gpdetails',
                    params: {
                        competition: this.grandPrix.competition.code,
                        season: this.grandPrix.season.name,
                        gp: (next ? this.grandPrix.nextGrandPrix.id : this.grandPrix.previousGrandPrix.id)
                    }
                };
                this.$router.push(params);
            }
        }
    });
</script>
