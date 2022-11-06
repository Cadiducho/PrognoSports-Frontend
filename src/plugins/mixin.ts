import {Circuit} from "@/types/Circuit";
import {
    cantidadPilotosPronosticados,
    hasVariant,
} from "@/utils";
import {RaceSession} from "@/types/RaceSession";
import {RuleSet} from "@/types/RuleSet";

let mixin = {
    methods: {
        hasVariant(circuit: Circuit): boolean {
            return hasVariant(circuit);
        },
        cantidadPilotosPronosticados(ruleSet: RuleSet, session: RaceSession): number {
            return cantidadPilotosPronosticados(ruleSet, session);
        }
    }
}

export default mixin;