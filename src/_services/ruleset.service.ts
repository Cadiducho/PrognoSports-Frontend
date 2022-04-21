import {PrognoService} from "@/_services/progno.service";
import {IRuleSet, RuleSet} from "@/types/RuleSet";
import axios from "axios";
import {Community} from "@/types/Community";
import {GrandPrix} from "@/types/GrandPrix";

export class RuleSetService extends PrognoService<IRuleSet, RuleSet> {

    factory(data: IRuleSet): RuleSet {
        return new RuleSet(data);
    }

    public async createRuleSet(data: any): Promise<RuleSet> {
        return await axios.post(`/rulesets`, data)
    }

    public async removeRuleSet(ruleset: RuleSet): Promise<RuleSet> {
        return await axios.delete(`/rulesets/${ruleset.id}`)
    }

    public async getRuleSetInGrandPrix(community: Community, grandPrix: GrandPrix): Promise<RuleSet> {
        return await axios.get(`/rulesets/${community.id}/${grandPrix.competition.id}/${grandPrix.season.id}/${grandPrix.id}`);
    }
}