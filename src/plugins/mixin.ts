import {UserRank} from "@/types/UserRank";
import {Circuit} from "@/types/Circuit";
import {cantidadPilotosPronosticados, hasVariant, isAdmin} from "@/utils";
import {RaceSession} from "@/types/RaceSession";
import {Community} from "@/types/Community";

let mixin = {
    methods: {
        isAdmin(rank: UserRank): boolean {
            return isAdmin(rank);
        },
        hasVariant(circuit: Circuit): boolean {
            return hasVariant(circuit);
        },
        cantidadPilotosPronosticados(currentCommunity: Community, session: RaceSession): number {
            return cantidadPilotosPronosticados(currentCommunity, session);
        }
    }
}

export default mixin;