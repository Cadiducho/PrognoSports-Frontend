import {Circuit, ICircuit} from "@/types/Circuit";
import {Season} from "@/types/Season";
import {Competition} from "@/types/Competition";
import {IRaceSession, RaceSession} from "@/types/RaceSession";
import {BASE_URL} from "@/_services";
import {CircuitVariant, ICircuitVariant} from "@/types/CircuitVariant";

export interface IGrandPrix {
    id: number;
    name: string;
    code: string;
    competition: Competition;
    season: Season;
    round: number;
    nextGrandPrix: IGrandPrix;
    previousGrandPrix: IGrandPrix;
    circuit?: ICircuit;
    variant?: ICircuitVariant;
    sessions: Array<IRaceSession>
    laps: number;
    suspended: boolean;
    hasPromoImage: boolean;
}

export class GrandPrix implements IGrandPrix {
    circuit?: Circuit;
    variant?: CircuitVariant;
    code: string;
    competition: Competition;
    id: number;
    laps: number;
    name: string;
    sessions: Array<RaceSession>;
    round: number;
    nextGrandPrix: IGrandPrix;
    previousGrandPrix: IGrandPrix;
    season: Season;
    suspended: boolean;
    hasPromoImage: boolean;

    constructor(data: IGrandPrix) {
        this.id = data.id;
        this.code = data.code;
        this.name = data.name;

        this.competition = data.competition;
        this.laps = data.laps;
        if (data.circuit && data.variant) {
            this.circuit = new Circuit(data.circuit);
            this.variant = new CircuitVariant(data.variant);
        }
        this.round = data.round;
        this.previousGrandPrix = data.previousGrandPrix;
        this.nextGrandPrix = data.nextGrandPrix;
        this.season = data.season;
        this.suspended = data.suspended;
        this.hasPromoImage = data.hasPromoImage;

        this.sessions = [];
        data.sessions?.forEach(session => {
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
                gp: this.id,
            }
        };
    }

    public promoImage(): string {
        if (this.hasPromoImage) {
            return BASE_URL + `/gps/${this.competition.code}/${this.season.name}/${this.id}/image`;
        }

        // ToDo: coger la imagen por defecto de los assets
        return 'https://github.com/Cadiducho/PrognoSports-Frontend/blob/develop/src/assets/default_profile_image.jpg?raw=true';
    }
}