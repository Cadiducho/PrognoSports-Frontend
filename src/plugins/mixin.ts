import {Circuit} from "@/types/Circuit";
import {
    cantidadPilotosPronosticados,
    hasVariant,
    isValidCommunity,
} from "@/utils";
import {RaceSession} from "@/types/RaceSession";
import {Community} from "@/types/Community";
import {RuleSet} from "@/types/RuleSet";

let mixin = {
    methods: {
        hasVariant(circuit: Circuit): boolean {
            return hasVariant(circuit);
        },
        cantidadPilotosPronosticados(ruleSet: RuleSet, session: RaceSession): number {
            return cantidadPilotosPronosticados(ruleSet, session);
        },
        isValidCommunity(community: Community): boolean {
            return isValidCommunity(community);
        }
    }
}

export default mixin;