<template>
    <div id="circuitDetails" class="box">
        <PrognoPageTitle class="mb-5" :name="communityName" />
        <div v-if="isLoading">
            <loading />
        </div>

        <p v-if="!thereIsCommunity">La comunidad con nombre <i>{{ this.$route.params.community }}</i> no ha sido encontrada</p>
        <template v-else>
            Validando invitación a la comunidad {{ community.name }}...
            <loading />
        </template>
    </div>
</template>


<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import {communityService} from "@/_services";

import {Community} from "@/types/Community";

@Component<ViewOneCommunity>({
    components: {
        PrognoPageTitle
    },
})
export default class ViewOneCommunity extends Vue {
    private community!: Community;
    private isLoading: boolean = true;
    private thereIsCommunity: boolean = false;

    created() {
        let communityId = this.$route.params.community;
        let code = this.$route.params.community;
        if (communityId == undefined || code == undefined) {
            this.$router.push('/communities');
        }

        communityService.getCommunityById(communityId).then((community) => {
            this.community = community;
            this.thereIsCommunity = true;

            communityService.joinCommunity(communityId, code).then((communityRes) => {
                this.$buefy.toast.open({
                    message: "¡Te has unido correctamente a " + communityRes.name + "!",
                    type: "is-success",
                });
                this.$router.push(`/communities/${communityRes.name}`);
            }).catch((reason => {
                this.$buefy.toast.open({
                    message: "Ha ocurrido un error: " + reason.message,
                    type: "is-warning",
                });
            }))
        }).catch((reason) => {
            this.thereIsCommunity = false;
        }).finally(() => {
            this.isLoading = false;
        })
    }

    get communityName() {
        if (this.thereIsCommunity) {
            return this.community.name;
        } else {
            return "Comunidad no encontrada";
        }
    }
}
</script>

<style scoped>
</style>