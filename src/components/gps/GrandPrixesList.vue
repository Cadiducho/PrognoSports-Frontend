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
    import GrandPrixPreview from "@/components/gps/GrandPrixPreview.vue";
    import {GrandPrix} from "@/types/GrandPrix";
    import {Season} from "@/types/Season";
    import {Competition} from "@/types/Competition";
    import {grandPrixService} from "@/_services";

    import {defineComponent, PropType} from "vue";
    import {useAuthStore} from "@/store/authStore";
    import {useCommunityStore} from "@/store/communityStore";

    export default defineComponent({
        name: "GrandPrixesList",
        components: {GrandPrixPreview},
        props: {
            searchType: {
                type: String,
                required: false,
            },
            competition: {
                type: Object as PropType<Competition>,
                required: true
            },
            season: {
                type: Object as PropType<Season>,
                required: true
            }
        },
        setup() {
            const authStore = useAuthStore();
            const communityStore = useCommunityStore();

            const currentUser = authStore.user;
            const currentCommunity = communityStore.community;
            return { currentUser, currentCommunity };
        },
        data() {
            return {
                isLoading: true,
                gps: new Array<GrandPrix>(),
            }
        },
        mounted() {
            grandPrixService.getGrandPrixesList(this.competition, this.season, this.searchType,).then((list) => {
                this.gps.push(...list);
                this.isLoading = false;
            });
        }
    });
</script>