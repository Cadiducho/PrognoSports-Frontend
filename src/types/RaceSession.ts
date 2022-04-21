import {Competition} from "@/types/Competition";
import {GrandPrix} from "@/types/GrandPrix";

export interface IRaceSession {
    name: string;
    code: string;
    competition: Competition;
    grandPrix: GrandPrix;
    date: Date;
}

export class RaceSession implements IRaceSession {
    competition: Competition;
    date: Date;
    grandPrix: GrandPrix;
    name: string;
    code: string;

    constructor(data: IRaceSession) {
        this.competition = data.competition;
        this.date = data.date;
        this.grandPrix = data.grandPrix;
        this.name = data.name;
        this.code = data.code;
    }

    // ToDo: i18n
    public humanName(): string {
        switch (this.name) {
            case "RACE": return "Carrera";
            case "QUALIFY": return "Clasificación";
            case "FRIDAY_QUALIFY": return "Clasif. de Sprint";
            case "SPRINT_RACE": return "Carrera Sprint";
            default: return this.name;
        }
    }
}