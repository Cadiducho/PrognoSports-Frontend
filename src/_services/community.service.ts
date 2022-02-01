import axios from 'axios';
import {Community, ICommunity} from "@/types/Community";
import {User} from "@/types/User";
import {CommunityUser} from "@/types/CommunityUser";
import {RuleSet} from "@/types/RuleSet";
import {PrognoService} from "@/_services/progno.service";
import {Notification} from "@/types/Notification";

export class CommunityService extends PrognoService<ICommunity, Community> {

    factory(data: ICommunity): Community {
        return new Community(data);
    }

    public async getCommunityById(communityId: string | number): Promise<Community> {
        return this.getObjectFromAPI(`/communities/${communityId}`);
    }

    public async getAllCommunities(): Promise<Array<Community>> {
        return this.getObjectListFromAPI("/communities");
    }

    public async getUserCommunities(user: User): Promise<Array<Community>> {
        return this.getObjectListFromAPI(`/user/${user.id}/communities`);
    }

    public async validateUserInCommunity(community: Community): Promise<boolean> {
        return await axios.get(`/communities/${community.id}/validate`);
    }

    public async joinCommunity(community: Community, code?: string): Promise<Community> {
        if (code) {
            return await axios.post(`/communities/${community.id}/join/${code}`);
        } else {
            return await axios.post(`/communities/${community.id}/join`);
        }
    }

    public async quitCommunity(community: Community): Promise<Community> {
        return await axios.post(`/communities/${community.id}/quit`)
    }

    public async getMembers(community: Community): Promise<Array<CommunityUser>> {
        return await axios.get(`/communities/${community.id}/members`)
    }

    public async createRuleSet(data: any): Promise<RuleSet> {
        return await axios.post(`/rulesets`, data)
    }

    public async removeRuleSet(ruleset: RuleSet): Promise<RuleSet> {
        return await axios.delete(`/rulesets/${ruleset.id}`)
    }

    public async createCommunity(data: any): Promise<Community> {
        return await axios.post(`/communities`, data)
    }
}
