<template>
    <div id="communtiesDropdown" class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link">
            Comunidad
        </a>

        <div class="navbar-dropdown">
            <router-link class="navbar-item" v-for="com in communitiesList" :to="'/communities/' + com.id" @click="switchToCommunity(com)">
                {{ com.name }}
            </router-link>
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
    import {CommunityModule} from "@/_store/modules/CommunityModule";
    const usermodule = namespace('user')
    const communitymodule = namespace('community')

    @Component<CommunitiesDropdown>({
        watch: {
            user() {
                this.getCommunityList();
            }
        }
    })
    export default class CommunitiesDropdown extends Vue {
        @usermodule.Getter private getProfile?: User;
        @usermodule.Getter private isProfileLoaded?: boolean;
        @communitymodule.Getter private getCurrentCommunity?: Community;
        private communitiesList: Array<Community> = [];

        // Variable para detectar los cambios en el watch
        get user(): User {
            return this.getProfile!;
        }

        getCommunityList(): Promise<any> {
            return communityService.getUserCommunities(this.user).then(list => {
                this.communitiesList = list;
            });
        }

        private switchToCommunity(community: Community) {
            CommunityModule.setCurrentUserCommunity(community);
        }
    }
</script>