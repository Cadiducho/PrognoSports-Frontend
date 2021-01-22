<template>
    <div id="communtiesDropdown" class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link">
            Comunidad
        </a>

        <div class="navbar-dropdown">
            <router-link class="navbar-item" v-for="com in communitiesList" v-bind:key="com.id" :to="'/communities/' + com.id" @click="switchToCommunity(com)">
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
    const Auth = namespace('Auth')

    @Component
    export default class CommunitiesDropdown extends Vue {
        @Auth.State("user") private currentUser!: User;
        @Auth.Getter private isProfileLoaded?: boolean;
        @Auth.State("community") private currentCommunity!: Community;
        @Auth.Action setCommunity!: (community: Community) => void;
        private communitiesList: Array<Community> = [];

        mounted() {
            this.getCommunityList();
        }

        getCommunityList(): Promise<any> {
            return communityService.getUserCommunities(this.currentUser).then(list => {
                this.communitiesList = list;
            });
        }

        private switchToCommunity(community: Community) {
            this.setCommunity(community);
        }
    }
</script>