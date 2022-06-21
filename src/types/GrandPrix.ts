import {Circuit} from "@/types/Circuit";
import {Season} from "@/types/Season";
import {Competition} from "@/types/Competition";
import {IRaceSession, RaceSession} from "@/types/RaceSession";

export interface IGrandPrix {
    id: string;
    name: string;
    code: string;
    competition: Competition;
    season: Season;
    round: number;
    circuit: Circuit;
    promo_image_url: string;
    sessions: Array<IRaceSession>
    laps: number;
    suspended: boolean;
}

export class GrandPrix implements IGrandPrix {
    circuit: Circuit;
    code: string;
    competition: Competition;
    id: string;
    laps: number;
    name: string;
    promo_image_url: string;
    sessions: Array<RaceSession>;
    round: number;
    season: Season;
    suspended: boolean;

    constructor(data: IGrandPrix) {
        this.circuit = data.circuit;
        this.code = data.code;
        this.competition = data.competition;
        this.id = data.id;
        this.laps = data.laps;
        this.name = data.name;
        this.promo_image_url = data.promo_image_url;
        this.round = data.round;
        this.season = data.season;
        this.suspended = data.suspended;

        this.sessions = [];
        data.sessions.forEach(session => {
            this.sessions.push(new RaceSession(session));
        })
    }

    firstDate(): Date {
        return new Date(Math.min(...this.sessions.map(ses => ses.date.getTime())));
    }

    lastDate(): Date {
        return new Date(Math.max(...this.sessions.map(ses => ses.date.getTime())));
    }

    gpLink(): Object {
        return {
            name: "gpdetails",
            params: {
                competition: this.competition.code,
                season: this.season.name,
                id: this.id,
            }
        };
    }
}