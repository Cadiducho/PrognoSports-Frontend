import {Constructor} from "@/types/Constructor";

export interface Driver {
    id: string;
    firstname: string;
    lastname: string;
    code: string;
    color: string;
    number: number;
    team: Constructor;
}