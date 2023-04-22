import {Season} from "@/types/Season";
import {IRaceSession, RaceSession} from "@/types/RaceSession";

export interface ICompetition {
    id: number;
    code: string;
    name: string;
    fullname: string;
    currentSeason: Season;
    rules: string;
    availableSessions: Array<IRaceSession>;
}

export class Competition implements ICompetition {

    availableSessions: Array<RaceSession>;
    code: string;
    currentSeason: Season;
    fullname: string;
    id: number;
    name: string;
    rules: string;

    constructor(data: ICompetition) {
        this.availableSessions = [];
        data.availableSessions?.forEach(ses => {
            this.availableSessions.push(new RaceSession(ses));
        })
        this.code = data.code;
        this.currentSeason = data.currentSeason;
        this.fullname = data.fullname;
        this.id = data.id;
        this.name = data.name;
        this.rules = data.rules;
    }
}