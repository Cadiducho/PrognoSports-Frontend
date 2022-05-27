
<template>
    <div id="circuitlist" class="box">
        <progno-page-title class="mb-5" name="Lista de Comunidades" />
        <div v-if="isLoading"><loading /></div>
        <div v-else>
            <div v-if="!thereIsCurrentCommunity" class="notification has-background-danger">
                No perteneces aún a ninguna comunidad. Para poder competir, debes unirte a alguna comunidad.
            </div>
            <o-tabs v-model="activeTab" variant="boxed">
                <o-tab-item label="Mis comunidades" :value="0">
                    <o-field>
                        <o-input
                            v-model="filtroComunidad"
                            placeholder="Buscar comunidad"
                            type="search"
                            icon-pack="fas"
                            icon="search"
                        ></o-input>
                    </o-field>
                    <CommunityListItem
                        v-for="(community, index) in filteredCommunities(this.myCommunityList)"
                        :community="community"
                        :isUserInCommunity="myCommunityList.some(c => c.id === community.id)"
                        v-bind:key="index"
                    />
                </o-tab-item>

                <o-tab-item label="Abiertas" :value="1">
                    <o-field>
                        <o-input
                            v-model="filtroComunidad"
                            placeholder="Buscar comunidad"
                            type="search"
                            icon-pack="fas"
                            icon="search"
                        ></o-input>
                    </o-field>
                    <CommunityListItem
                        v-for="(community, index) in openCommunities"
                        :community="community"
                        :isUserInCommunity="myCommunityList.some(c => c.id === community.id)"
                        v-bind:key="index"
                    />
                </o-tab-item>

                <o-tab-item label="Cerradas" :value="2">
                    <o-field>
                        <o-input
                            v-model="filtroComunidad"
                            placeholder="Buscar comunidad"
                            type="search"
                            icon-pack="fas"
                            icon="search"
                        ></o-input>
                    </o-field>
                    <div class="notification has-background-info-light">Para formar parte de comunidades cerradas necesitarás una invitación</div>
                    <CommunityListItem
                        v-for="(community, index) in closedCommunities"
                        :community="community"
                        :isUserInCommunity="myCommunityList.some(c => c.id === community.id)"
                        v-bind:key="index"
                    />
                </o-tab-item>

                <o-tab-item label="Todas" :value="3">
                    <o-field>
                        <o-input
                            v-model="filtroComunidad"
                            placeholder="Buscar comunidad"
                            type="search"
                            icon-pack="fas"
                            icon="search"
                        ></o-input>
                    </o-field>
                    <CommunityListItem
                        v-for="(community, index) in filteredCommunities(this.communityList)"
                        :community="community"
                        :isUserInCommunity="myCommunityList.some(c => c.id === community.id)"
                        v-bind:key="index"
                    />
                </o-tab-item>
            </o-tabs>

        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import {Community} from "@/types/Community";
import {communityService} from "@/_services";
import CommunityListItem from "@/components/communities/CommunityListItem.vue";
import {User} from "@/types/User";
import {namespace} from "vuex-class";
import EventBus from "@/plugins/eventbus";
const Auth = namespace('Auth')

@Component<ViewCommunitiesList>({
    components: {
        CommunityListItem,
        PrognoPageTitle,
    },
})
export default class ViewCommunitiesList extends Vue {
    @Auth.State("user") private currentUser!: User;
    @Auth.Getter private thereIsCurrentCommunity?: boolean;
    private activeTab: number = 1;
    private communityList: Array<Community> = [];
    private myCommunityList: Array<Community> = [];
    private filtroComunidad: String = '';
    private isLoading: boolean = true;

    mounted() {
        this.loadCommunities();

        EventBus.$on('reloadCommunitiesList', () => {
            this.isLoading = true;
            this.loadCommunities();
        });
    }

    loadCommunities() {
        communityService.getAllCommunities().then((communities) => {
            this.communityList = [];
            this.communityList.push(...communities);

            communityService.getUserCommunities(this.currentUser).then(userCommunities => {
                this.myCommunityList = [];
                this.myCommunityList.push(...userCommunities);
                this.isLoading = false;
            })
        });
    }

    private filteredCommunities(orinalList: Array<Community>): Array<Community> {
        if (!this.filtroComunidad.trim()) {
            return orinalList;
        }

        const filtroLowerCase: string = this.filtroComunidad.toLowerCase().trim();

        return orinalList.filter((community) => {
            return (
                community.name
                    .toLowerCase()
                    .includes(filtroLowerCase) ||
                community.owner.username
                    .toLowerCase()
                    .includes(filtroLowerCase)
            );
        });
    }

    get openCommunities(): Array<Community> {
        return this.filteredCommunities(this.communityList).filter(({open}) => (open));
    }

    get closedCommunities(): Array<Community> {
        return this.filteredCommunities(this.communityList).filter(({open}) => (!open));
    }
}
</script>