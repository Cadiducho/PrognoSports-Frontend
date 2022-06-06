<template>
    <div id="circuitDetails" class="box">
        <PrognoPageTitle class="mb-5" :name="communityName" />

        <loading v-if="isLoading"/>

        <p v-if="!thereIsCommunity">La comunidad con nombre <i>{{ this.$route.params.community }}</i> no ha sido encontrada</p>
        <template v-else>
            Validando invitación a la comunidad {{ community.name }}...
            <loading />
        </template>
    </div>
</template>


<script lang="ts">
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import {communityService} from "@/_services";

import {Community} from "@/types/Community";

import {defineComponent} from "vue";
import {useCommunityStore} from "@/pinia/communityStore";

export default defineComponent({
    name: "ViewOneCommunity",
    components: {
        PrognoPageTitle
    },
    setup() {
        const communityStore = useCommunityStore();

        const setCommunity = communityStore.setCommunity;
        return { setCommunity };
    },
    data() {
        return {
            community: {} as Community,
            isLoading: true,
            thereIsCommunity: false,
        }
    },
    created() {
        let communityId = this.$route.params.community;
        let code = this.$route.params.code;

        communityService.getCommunityById(communityId).then((community) => {
            this.community = community;
            this.thereIsCommunity = true;

            communityService.joinCommunity(community, code).then((communityRes) => {
                setTimeout(() => {
                    this.$oruga.notification.open({
                        message: "¡Te has unido correctamente a " + communityRes.name + "!",
                        variant: "success",
                    });
                    this.setCommunity(communityRes);
                    this.$router.push({
                        name: 'communitiesDetails',
                        params:  {
                            community: communityRes.name,
                        }
                    });
                }, 500);
            }).catch((reason => {
                setTimeout(() => {
                    this.$oruga.notification.open({
                        message: "Ha ocurrido un error: " + reason.message,
                        variant: "danger",
                    });
                    this.$router.push({
                        name: 'communitiesList',
                    });
                }, 500);
            }))
        }).catch((reason) => {
            this.thereIsCommunity = false;
        }).finally(() => {
            this.isLoading = false;
        })
    },
    computed: {
        communityName() {
            if (this.thereIsCommunity) {
                return this.community.name;
            } else {
                return "Comunidad no encontrada";
            }
        }
    }
});
</script>
