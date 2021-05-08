import {UserRank} from "@/types/UserRank";
import {Circuit} from "@/types/Circuit";
import {cantidadPilotosPronosticados, hasVariant, isAdmin, isBeforeEndDate} from "@/utils";
import {RaceSession} from "@/types/RaceSession";
import {Community} from "@/types/Community";
import {GrandPrix} from "@/types/GrandPrix";

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
        },
        isBeforeEndDate(grandPrix: GrandPrix, session: RaceSession): boolean {
            return isBeforeEndDate(grandPrix, session);
        }
    }
}

export default mixin;