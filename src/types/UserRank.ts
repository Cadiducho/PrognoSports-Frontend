export class UserRank {
    id: number;
    name: string;
    color: string; //hex code

    constructor(id: number, name: string, color: string) {
        this.id = id;
        this.name = name;
        this.color = color;
    }

    get isAdmin(): boolean {
        return this.name.toLowerCase() === "admin";
    }
}