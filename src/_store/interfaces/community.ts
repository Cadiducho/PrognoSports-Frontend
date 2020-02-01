import {Community} from "@/types/Community";

export interface State {
    currentCommunityId: string;
    currentCommunity: undefined | Community;
}