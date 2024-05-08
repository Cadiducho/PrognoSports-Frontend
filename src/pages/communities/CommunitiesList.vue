
<template>
    <div id="circuitlist" class="box">
        <PTitle class="mb-5" name="Lista de Comunidades" />
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
import PTitle from "@/components/lib/PTitle.vue";
import {Community} from "@/types/Community";
import {communityService} from "@/_services";
import CommunityListItem from "@/components/communities/CommunityListItem.vue";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import useEmitter from "@/composables/useEmitter";

export default defineComponent({
    name: "CommunitiesList",
    components: {
        CommunityListItem,
        PTitle,
    },
    setup() {
        const emitter = useEmitter();
        const authStore = useAuthStore();
        const communityStore = useCommunityStore();

        const currentUser = authStore.loggedUser;
        const thereIsCurrentCommunity = communityStore.thereIsCurrentCommunity;
        return { currentUser, thereIsCurrentCommunity, emitter };
    },
    data() {
        return {
            activeTab: 1,
            communityList: new Array<Community>(),
            myCommunityList: new Array<Community>(),
            filtroComunidad: '',
            isLoading: true,
        }
    },
    mounted() {
        this.loadCommunities();

        this.emitter.on('reloadCommunitiesList', () => {
            this.isLoading = true;
            this.loadCommunities();
        });
    },
    methods: {
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
        },
        filteredCommunities(orinalList: Array<Community>): Array<Community> {
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
    },
    computed: {
        openCommunities(): Array<Community> {
            return this.filteredCommunities(this.communityList).filter(({open}) => (open));
        },
        closedCommunities(): Array<Community> {
            return this.filteredCommunities(this.communityList).filter(({open}) => (!open));
        }
    }
});
</script>