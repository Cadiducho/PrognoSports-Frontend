import {grandPrixService} from "@/_services";
import store from '@/_store'
import {Action, getModule, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {GrandPrix} from "@/types/GrandPrix";
import {Driver} from "@/types/Driver";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";

export interface IGPsState {
    grandPrix: GrandPrix,
    loadingGrandPrix: boolean,
    startGrid: Array<Driver>,
    nextGp: GrandPrix,
    loadingNextGp: boolean,
    gpList: Array<GrandPrix>,
    loadingGps: boolean,
}

@Module({dynamic: true, store: store, namespaced: true, name: 'grandprix' })
class GPsMod extends VuexModule implements IGPsState {
    grandPrix = {} as GrandPrix;
    loadingGrandPrix = true;
    startGrid = [] as Array<Driver>;
    nextGp = {} as GrandPrix;
    loadingNextGp = true;
    gpList = [] as Array<GrandPrix>;
    loadingGps = true;

    get getGrandPrix(): GrandPrix {
        return this.grandPrix;
    }

    get isLoadingGrandPrix(): boolean {
        return this.loadingNextGp;
    }

    //FixMe: Esto no debería estar en vuex....
    get getStartGrid(): Array<Driver> {
        return this.startGrid;
    }

    get getNextGp(): GrandPrix {
        return this.nextGp;
    }

    get isLoadingNextGrandPrix(): boolean {
        return this.loadingNextGp;
    }

    get getGrandPrixesList(): Array<GrandPrix> {
        return this.gpList;
    }

    get isLoadingGrandPrixesList(): boolean {
        return this.loadingGps;
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

    @Action
    async fetchNextGrandPrix(competition: Competition) {
        this.fetchNextGPStart();
        return new Promise((resolve, reject) => {
            grandPrixService.getNextGrandPrix(competition)
                .then(nextGp => {
                    this.fetchNextGPEnd(nextGp);
                })
        });
    }

    @Action
    async fetchGrandPrixesList(payload: {competition: Competition, season: Season, searchType: string}) {
        let {competition, season, searchType} = payload;
        this.fetchGpListStart();
        console.log("comp para " + JSON.stringify(competition));
        console.log("sea para " + JSON.stringify(season));
        return new Promise((resolve, reject) => {
            grandPrixService.getGrandPrixesList(searchType, competition, season)
                .then(list => {
                    this.fetchGpListEnd(list);
                })
        });
    }

    @Mutation
    fetchNextGPStart() {
        this.loadingNextGp = true;
    }

    @Mutation
    fetchNextGPEnd(grandPrix: GrandPrix) {
        this.nextGp = grandPrix;
        this.loadingNextGp = false;
    }

    @Mutation
    fetchGpListStart() {
        this.gpList = [] as Array<GrandPrix>;
        this.loadingGps = true;
    }

    @Mutation
    fetchGpListEnd(gps: Array<GrandPrix>) {
        this.gpList = gps;
        this.loadingGps = false;
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