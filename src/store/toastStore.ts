import {defineStore} from "pinia";
import {Position} from "vue-sonner/lib/types";

export const useToastStore = defineStore('toast', {
    state: () => ({
        position: "top-center" as Position,
    }),
    getters: {
        getPosition(): Position {
            return this.position;
        }
    }
});