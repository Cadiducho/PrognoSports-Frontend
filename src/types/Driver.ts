import {Constructor} from "@/types/Constructor";

export interface Driver {
    id: number;
    firstname: string;
    lastname: string;
    code: string;
    nationality: string;
    birth: Date;

    // Event related data
    color: string;
    number: number;
    team: Constructor;
}