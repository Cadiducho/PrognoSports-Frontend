import {Circuit} from "@/types/Circuit";
import {
    cantidadPilotosPronosticados,
    hasVariant,
    isAdmin,
    isBeforeEndDate, isValidCommunity,
    isValidUser,
    userProfileImage
} from "@/utils";
import {RaceSession} from "@/types/RaceSession";
import {Community} from "@/types/Community";
import {GrandPrix} from "@/types/GrandPrix";
import {User} from "@/types/User";
import {UserRank} from "@/types/UserRank";

let mixin = {
    methods: {
        isAdmin(user: User): boolean {
            return isAdmin(user);
        },
        userProfileImage(user: User): string {
            return userProfileImage(user);
        },
        styleRankTag(rank: UserRank) {
            return {
                backgroundColor: '#' + rank.color,
                color: 'white',
            }
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
        },
        isValidCommunity(community: Community): boolean {
            return isValidCommunity(community);
        },
        isValidUser(user: User): boolean {
            return isValidUser(user);
        },
    }
}

export default mixin;