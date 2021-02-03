import {UserRank} from "@/types/UserRank";
import {Circuit} from "@/types/Circuit";
import {hasVariant, isAdmin} from "@/utils";

let mixin = {
    methods: {
        isAdmin(rank: UserRank): boolean {
            return isAdmin(rank);
        },
        hasVariant(circuit: Circuit): boolean {
            return hasVariant(circuit);
        }
    }
}

export default mixin;