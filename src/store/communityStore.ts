import {defineStore} from "pinia";
import {User} from "@/types/User";
import {Community} from "@/types/Community";
import {communityService} from "@/_services";

export const useCommunityStore = defineStore('community', {
    state: () => ({
        community: {id: 0} as Community,
        communityId: Number.parseInt(localStorage.getItem('community') ?? '0') ?? 0,
    }),
    getters: {
        thereIsCurrentCommunity(): boolean {
            return this.community.id !== 0;
        },
        currentCommunity(): Community {
            return this.community;
        },
        storedCommunityId(): number {
            return this.communityId;
        }
    },
    actions: {
        /** Si todavía no se ha elegido una comunidad, se parte de la que indica el usuario */
        initFromUser(user: User): void {
            if (this.communityId === 0) {
                this.communityId = user.currentCommunity?.id ?? 0;
            }
        },
        setCurrentCommunity(community: Community): void {
            this.community = community;
            this.communityId = community.id;
        },
        removeCurrentCommunity(): void {
            localStorage.removeItem('community');
            this.community = {id: 0} as Community;
            this.communityId = this.community.id;
        },

        setCommunity(community: Community): void {
            localStorage.setItem('community', String(community.id ?? 0));
            this.setCurrentCommunity(community);
        },
        removeCommunity(): void {
            localStorage.removeItem('community');
            this.removeCurrentCommunity();
        },

        communityRequest(payload: { communityId: number }): Promise<Community> {
            const {communityId} = payload;

            return communityService.getCommunityById(communityId).then(
                community => {
                    this.setCommunity(community);
                    return Promise.resolve(community);
                },
                error => {
                    this.removeCurrentCommunity();
                    return Promise.reject(error);
                }
            );
        },
    }
});
