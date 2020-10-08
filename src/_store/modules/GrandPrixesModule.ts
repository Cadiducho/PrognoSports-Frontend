import {grandPrixService} from "@/_services";
import store from '@/_store'
import {Action, getModule, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {GrandPrix} from "@/types/GrandPrix";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";

export interface IGPsState {
    grandPrix: GrandPrix,
    loadingGrandPrix: boolean,
}

@Module({dynamic: true, store: store, namespaced: true, name: 'grandprix' })
class GPsMod extends VuexModule implements IGPsState {
    grandPrix = {} as GrandPrix;
    loadingGrandPrix = true;

    get getGrandPrix(): GrandPrix {
        return this.grandPrix;
    }

    @Action
    async fetchGrandPrix(payload: {competition: Competition, season: Season, id: string}) {
        let {competition, season, id} = payload;
        this.fetchGrandPrixStart();
        return new Promise((resolve, reject) => {
            grandPrixService.getGrandPrix(competition, season, id)
                .then(gp => {
                    this.fetchGrandPrixEnd(gp);
                })
        });
    }

    @Mutation
    fetchGrandPrixStart() {
        this.loadingGrandPrix = true;
    }

    @Mutation
    fetchGrandPrixEnd(grandPrix: GrandPrix) {
        this.grandPrix = grandPrix;
        this.loadingGrandPrix = false;
    }
}
export const GrandPrixesModule: GPsMod = getModule(GPsMod);