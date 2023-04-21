import {Circuit} from "@/types/Circuit";
import {
    hasVariant,
} from "@/utils";

let mixin = {
    methods: {
        hasVariant(circuit: Circuit): boolean {
            return hasVariant(circuit);
        },
    }
}

export default mixin;