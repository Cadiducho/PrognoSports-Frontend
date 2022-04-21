import {PrognoService} from "@/_services/progno.service";
import {IRuleSet, RuleSet} from "@/types/RuleSet";
import axios from "axios";
import {Community} from "@/types/Community";
import {GrandPrix} from "@/types/GrandPrix";

export class RuleSetService extends PrognoService<IRuleSet, RuleSet> {

    factory(data: IRuleSet): RuleSet {
        return new RuleSet(data);
    }

    public async getRuleSetFromId(id: number): Promise<RuleSet> {
        return this.getObjectFromAPI(`/rulesets/${id}`);
    }

    public async getRuleSetList(): Promise<Array<RuleSet>> {
        return this.getObjectListFromAPI(`/rulesets`);
    }

    public async getRuleSetInGrandPrix(community: Community, grandPrix: GrandPrix): Promise<RuleSet> {
        return this.getObjectFromAPI(`/rulesets/${community.id}/${grandPrix.competition.id}/${grandPrix.season.id}/${grandPrix.id}`);
    }

    public async createRuleSet(data: any): Promise<RuleSet> {
        return await axios.post(`/rulesets`, data)
    }

    public async removeRuleSet(ruleset: RuleSet): Promise<RuleSet> {
        return await axios.delete(`/rulesets/${ruleset.id}`)
    }
}