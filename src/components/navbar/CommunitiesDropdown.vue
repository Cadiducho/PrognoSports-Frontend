<template>
    <div id="communtiesDropdown" class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link">
            {{ currentCommunity.name }}
        </a>

        <div class="navbar-dropdown">
            <router-link class="navbar-item is-active":to="{name: 'communitiesDetails', params: { community: currentCommunity.name}}">
                {{ currentCommunity.name }}
            </router-link>
            <hr class="navbar-divider">
            <a class="navbar-item" v-for="com in communitiesList" v-bind:key="com.id" @click="switchToCommunity(com)">
                {{ com.name }}
            </a>
            <hr class="navbar-divider">
            <router-link class="navbar-item" to="/communities">
                Todas las comunidades
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {Community} from "@/types/Community";
    import {communityService} from "@/_services";
    import {namespace} from "vuex-class";
    import {User} from "@/types/User";
    import EventBus from "@/plugins/eventbus";
    const Auth = namespace('Auth')

    @Component
    export default class CommunitiesDropdown extends Vue {
        @Auth.State("user") private currentUser!: User;
        @Auth.Getter private isProfileLoaded?: boolean;
        @Auth.State("community") private currentCommunity!: Community;
        @Auth.Action setCommunity!: (community: Community) => void;
        private communitiesList: Array<Community> = [];

        mounted() {
            EventBus.$on('reloadCommunitiesDropdown', () => {
                this.getCommunityList();
            });
            this.getCommunityList();
        }

        getCommunityList(): Promise<any> {
            return communityService.getUserCommunities(this.currentUser).then(list => {
                this.communitiesList = [];
                list.forEach(comm => {
                    // Agregar todas menos la activa, que ya saldrá en la primera
                    if (comm.name !== this.currentCommunity.name) {
                        this.communitiesList.push(comm);
                    }
                })
            });
        }

        private switchToCommunity(targetCommunity: Community) {
            this.setCommunity(targetCommunity);

            this.$router.push({
                name: 'communitiesDetails',
                params:  {
                    community: targetCommunity.name,
                }
            }).then(() => {
                this.$buefy.toast.open({
                    message:
                        "Has cambiado a la comunidad " + targetCommunity.name,
                    type: "is-info",
                });
            })
        }
    }
</script>