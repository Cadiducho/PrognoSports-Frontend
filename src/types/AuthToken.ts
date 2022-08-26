import {INotification} from "@/types/Notification";

export interface IAuthToken {
    current: boolean;
    ipAddress: string;
    createdAt: Date | string;
    lastActivityAt:  Date | string;
    lifetime: number;
    token: string;
}

export class AuthToken implements IAuthToken {
    current: boolean;
    ipAddress: string;
    createdAt: Date;
    lastActivityAt:  Date;
    lifetime: number;
    token: string;

    constructor(token: IAuthToken) {
        this.current = token.current;
        this.ipAddress = token.ipAddress;
        this.createdAt = new Date(token.createdAt);
        this.lastActivityAt = new Date(token.lastActivityAt);
        this.lifetime = token.lifetime;
        this.token = token.token;
    }

}