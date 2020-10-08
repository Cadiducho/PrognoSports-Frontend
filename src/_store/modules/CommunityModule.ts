import {communityService} from "@/_services/community.service";
import {Community} from "@/types/Community";
import store from '@/_store'
import {Action, getModule, Module, Mutation, VuexModule} from 'vuex-module-decorators'

@Module({dynamic: true, store: store, namespaced: true, name: 'community' })
class CommunityMod extends VuexModule {
    currentCommunityId: number = parseInt(<string>localStorage.getItem('current-community')) || -1;
    currentCommunity: Community = {} as Community;
    loadingCurrentCommunity: boolean = true;

    get getCurrentCommunity(): Community {
        return this.currentCommunity;
    }

    get thereIsCurrentCommunity() {
        return this.currentCommunityId > 0;
    }

    get isLoadingCurrentCommunity() {
        return this.loadingCurrentCommunity;
    }

    @Action
    async communityRequest() {
        return new Promise((resolve, reject) => {
            communityService.getCurrentCommunity(this.currentCommunityId)
                .then(community => {
                    this.setCurrentUserCommunity(community);
                    resolve(community)
                })
                .catch(resp => {
                    this.removeCurrentUserCommunity();
                    reject();
                })
        });
    }

    @Mutation
    setCurrentUserCommunity(community: Community) {
        this.currentCommunity = community;
        localStorage.setItem('current-community', String(community.id));
        this.currentCommunityId = community.id;
        this.loadingCurrentCommunity = false;
    }

    @Mutation
    removeCurrentUserCommunity() {
        this.currentCommunity = {} as Community;
        this.currentCommunityId = -1;
        localStorage.removeItem('current-community');
        this.loadingCurrentCommunity = true;
    }
}

export const CommunityModule: CommunityMod = getModule(CommunityMod);