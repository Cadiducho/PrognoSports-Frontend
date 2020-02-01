import {User} from "@/types/User";

export interface State {
    status: string;
    profile: undefined | User;
    registeredMail: string;
}