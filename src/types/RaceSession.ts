import {Competition} from "@/types/Competition";
import {GrandPrix} from "@/types/GrandPrix";
import {useDayjs} from "@/composables/useDayjs";

export interface IRaceSession {
    name: string;
    code: string;
    hasGrid: boolean;
    competition: Competition;
    grandPrix: GrandPrix;
    date: Date | string;
    uses: number;
}

export class RaceSession implements IRaceSession {
    competition: Competition;
    date: Date;
    hasGrid: boolean;
    grandPrix: GrandPrix;
    name: string;
    code: string;
    uses: number;

    constructor(data: IRaceSession) {
        this.competition = data.competition;
        this.date = new Date(data.date);
        this.hasGrid = data.hasGrid;
        this.grandPrix = data.grandPrix;
        this.name = data.name;
        this.code = data.code;
        this.uses = data.uses;
    }

    // ToDo: i18n
    public humanName(): string {
        switch (this.name) {
            case "RACE": return "Carrera";
            case "QUALIFY": return "Clasificación";
            case "SPRINT_QUALIFY": return "Clasif. de Sprint";
            case "SPRINT_RACE": return "Carrera Sprint";
            default: return this.name;
        }
    }

    /**
     * Hora de cierre de un pronóstico. 5 minutos antes de la fecha de la sesión
     */
    public closureDate(): Date {
        const dayjs = useDayjs();
        return dayjs.minusFiveMinutes(this.date).toDate();
    }

    /**
     * Verdadero si la fecha actual es anterior a la fecha de cierre del pronostico
     */
    public isBeforeClosureDate(): boolean {
        const dayjs = useDayjs();
        return dayjs.isBefore(this.closureDate());
    }
}