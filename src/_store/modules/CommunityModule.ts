import {communityService} from "@/_services/community.service";
import {Community} from "@/types/Community";
import store from '@/_store'
import {Action, getModule, Module, Mutation, VuexModule} from 'vuex-module-decorators'

export interface ICommunityState {
    currentCommunityId: number;
    currentCommunity: Community;
}

@Module({dynamic: true, store: store, namespaced: true, name: 'community' })
class CommunityMod extends VuexModule implements ICommunityState {
    currentCommunityId: number = parseInt(<string>localStorage.getItem('current-community')) || -1;
    currentCommunity: Community = {} as Community;

    get thereIsCurrentCommunity() {
        return this.currentCommunityId > 0;
    }

    @Action
    async communityRequest() {
        return new Promise((resolve, reject) => {
            communityService.getCurrentCommunity(this.currentCommunityId)
                .then(community => {
                    this.setCurrentUserCommunity(community);
                })
                .catch(resp => {
                    this.removeCurrentUserCommunity();
                })
        });
    }

    @Mutation
    setCurrentUserCommunity(community: Community) {
        this.currentCommunity = community;
        localStorage.setItem('current-community', String(community.id));
        this.currentCommunityId = community.id;
    }

    @Mutation
    removeCurrentUserCommunity() {
        this.currentCommunity = {} as Community;
        this.currentCommunityId = -1;
        localStorage.removeItem('current-community');
    }
}

export const CommunityModule: CommunityMod = getModule(CommunityMod);