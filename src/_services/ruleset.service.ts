import {getObject, getObjectList} from "@/_services/api";
import {mapRuleSet, RuleSet} from "@/types/RuleSet";
import axios from "axios";
import {Community} from "@/types/Community";
import {GrandPrix} from "@/types/GrandPrix";
import {Season} from "@/types/Season";

export class RuleSetService {
    public async getRuleSetFromId(id: number): Promise<RuleSet> {
        return getObject(`/rulesets/${id}`, mapRuleSet);
    }

    public async getRuleSetList(): Promise<Array<RuleSet>> {
        return getObjectList(`/rulesets`, mapRuleSet);
    }

    public async getRuleSetInSeason(community: Community, season: Season): Promise<RuleSet> {
        return getObject(`/rulesets/communities/${community.id}/${season.id}`, mapRuleSet);
    }

    public async getRuleSetInGrandPrix(community: Community, grandPrix: GrandPrix): Promise<RuleSet> {
        return getObject(`/rulesets/communities/${community.id}/${grandPrix.competition.id}/${grandPrix.season.id}/${grandPrix.id}`, mapRuleSet);
    }

    public async createRuleSet(data: any): Promise<RuleSet> {
        return await axios.post(`/rulesets`, data)
    }

    public async removeRuleSet(ruleset: RuleSet): Promise<RuleSet> {
        return await axios.delete(`/rulesets/${ruleset.id}`)
    }
}