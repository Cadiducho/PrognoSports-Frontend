
<template>
    <div id="circuitlist" class="box">
        <progno-page-title class="mb-5" name="Lista de Comunidades" />
        <div v-if="isLoading"><loading /></div>
        <div v-else>
            <b-tabs v-model="activeTab" type="is-boxed">
                <b-tab-item label="Mis comunidades">
                    <b-field>
                        <b-input
                            v-model="filtroComunidad"
                            placeholder="Buscar comunidad"
                            type="search"
                            icon-pack="fas"
                            icon="search"
                        ></b-input>
                    </b-field>
                    <CommunityListItem
                        v-for="(community, index) in filteredCommunities(this.myCommunityList)"
                        :community="community"
                        v-bind:key="index"
                    />
                </b-tab-item>

                <b-tab-item label="Abiertas">
                    <b-field>
                        <b-input
                            v-model="filtroComunidad"
                            placeholder="Buscar comunidad"
                            type="search"
                            icon-pack="fas"
                            icon="search"
                        ></b-input>
                    </b-field>
                    <CommunityListItem
                        v-for="(community, index) in openCommunities"
                        :community="community"
                        v-bind:key="index"
                    />
                </b-tab-item>

                <b-tab-item label="Cerradas">
                    <b-field>
                        <b-input
                            v-model="filtroComunidad"
                            placeholder="Buscar comunidad"
                            type="search"
                            icon-pack="fas"
                            icon="search"
                        ></b-input>
                    </b-field>
                    <CommunityListItem
                        v-for="(community, index) in closedCommunities"
                        :community="community"
                        v-bind:key="index"
                    />
                </b-tab-item>

                <b-tab-item label="Todas">
                    <b-field>
                        <b-input
                            v-model="filtroComunidad"
                            placeholder="Buscar comunidad"
                            type="search"
                            icon-pack="fas"
                            icon="search"
                        ></b-input>
                    </b-field>
                    <CommunityListItem
                        v-for="(community, index) in filteredCommunities(this.communityList)"
                        :community="community"
                        v-bind:key="index"
                    />
                </b-tab-item>
            </b-tabs>

        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import {Community} from "@/types/Community";
import {communityService} from "@/_services";
import CommunityListItem from "@/components/communities/CommunityListItem.vue";
import {User} from "@/types/User";
import {namespace} from "vuex-class";
const usermodule = namespace('user')

@Component<ViewCommunitiesList>({
    components: {
        CommunityListItem,
        PrognoPageTitle,
    },
})
export default class ViewCommunitiesList extends Vue {
    @usermodule.Getter private getProfile?: User;
    private activeTab: number = 1;
    private communityList: Array<Community> = [];
    private myCommunityList: Array<Community> = [];
    private filtroComunidad: String = '';
    private isLoading: boolean = true;

    created() {
        this.loadCommunities();
    }

    loadCommunities() {
        communityService.getAllCommunities().then((communities) => {
            this.communityList.push(...communities);
            communityService.getUserCommunities(this.getProfile!).then(userCommunities => {

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