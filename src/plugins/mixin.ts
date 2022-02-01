import {UserRank} from "@/types/UserRank";
import {Circuit} from "@/types/Circuit";
import {cantidadPilotosPronosticados, hasVariant, isAdmin, isBeforeEndDate, userProfileImage} from "@/utils";
import {RaceSession} from "@/types/RaceSession";
import {Community} from "@/types/Community";
import {GrandPrix} from "@/types/GrandPrix";
import {User} from "@/types/User";

let mixin = {
    methods: {
        isAdmin(rank: UserRank): boolean {
            return isAdmin(rank);
        },
        userProfileImage(user: User): string {
            return userProfileImage(user);
        },
        hasVariant(circuit: Circuit): boolean {
            return hasVariant(circuit);
        },
        cantidadPilotosPronosticados(currentCommunity: Community, session: RaceSession): number {
            return cantidadPilotosPronosticados(currentCommunity, session);
        },
        isBeforeEndDate(grandPrix: GrandPrix, session: RaceSession): boolean {
            return isBeforeEndDate(grandPrix, session);
        },
        sessionHumanName(session: RaceSession): string {
            if (session == RaceSession.QUALIFY) return "Clasificación";
            if (session == RaceSession.SPRINT_RACE) return "Carrera Sprint";
            if (session == RaceSession.RACE) return "Carrera";
            return "Sesión desconocida";

        }
    }
}

export default mixin;