import {Circuit} from "@/types/Circuit";
import {
    cantidadPilotosPronosticados,
    hasVariant,
    isAdmin,
    isValidCommunity,
    isValidUser,
    userProfileImage
} from "@/utils";
import {RaceSession} from "@/types/RaceSession";
import {Community} from "@/types/Community";
import {User} from "@/types/User";
import {UserRank} from "@/types/UserRank";
import {RuleSet} from "@/types/RuleSet";

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
        cantidadPilotosPronosticados(ruleSet: RuleSet, session: RaceSession): number {
            return cantidadPilotosPronosticados(ruleSet, session);
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