import {Competition, ICompetition} from "@/types/Competition";
import {GrandPrix, IGrandPrix} from "@/types/GrandPrix";
import {useDayjs} from "@/composables/useDayjs";

export interface IRaceSession {
    id: number;
    name: string;
    code: string;
    hasGrid: boolean;
    hasFastLap: boolean;
    competition?: ICompetition;
    grandPrix?: IGrandPrix;
    date: Date;
    uses: number;
    defineGridOf: Array<RaceSession>;
}

export class RaceSession implements IRaceSession {
    id: number;
    name: string;
    code: string;
    hasGrid: boolean;
    hasFastLap: boolean;
    competition?: Competition;
    grandPrix?: GrandPrix;
    date: Date;
    uses: number;
    defineGridOf: Array<RaceSession>;

    constructor(data: IRaceSession) {
        this.id = data.id;
        if (data.competition) {
            this.competition = new Competition(data.competition);
        }
        this.date = new Date(data.date);
        this.hasGrid = data.hasGrid;
        this.hasFastLap = data.hasFastLap;
        if (data.grandPrix) {
            this.grandPrix = new GrandPrix(data.grandPrix);
        }
        this.name = data.name;
        this.code = data.code;
        this.uses = data.uses;
        this.defineGridOf = data.defineGridOf || [];
        if (this.defineGridOf.length) {
            this.defineGridOf = this.defineGridOf.map(session => new RaceSession(session));
        }
    }

    // ToDo: i18n
    public humanName(): string {
        switch (this.name) {
            case "RACE": return "Carrera";
            case "QUALIFY": return "Clasificación";
            case "SPRINT_QUALIFY": return "Clasif. para Sprint";
            case "SPRINT_RACE": return "Carrera Sprint";
            default: return this.name;
        }
    }

    /**
     * Hora de cierre de un pronóstico. 5 minutos antes de la fecha de la sesión
     */
    public closureDate(): Date {
        const {minusFiveMinutes} = useDayjs();
        return minusFiveMinutes(this.date).toDate();
    }

    /**
     * Verdadero si la fecha actual es anterior a la fecha de cierre del pronostico
     */
    public isBeforeClosureDate(): boolean {
        const {isBefore} = useDayjs();
        return isBefore(this.closureDate());
    }

    public static findById(id: number): RaceSession | undefined {
        switch (Number(id)) {
            case 1: return new RaceSession({name: "QUALIFY"} as IRaceSession);
            case 2: return new RaceSession({name: "RACE"} as IRaceSession);
            case 3: return new RaceSession({name: "SPRINT_QUALIFY"} as IRaceSession);
            case 4: return new RaceSession({name: "SPRINT_RACE"} as IRaceSession);
            default: return undefined;
        }
    }
}