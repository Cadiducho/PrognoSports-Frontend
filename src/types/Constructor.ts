export interface IConstructor {
    id: number;
    name: string;
    carname: string;
    longname: string;
    teamcolor: string;
}

export class Constructor implements IConstructor {

    id: number;
    name: string;
    carname: string;
    longname: string;
    teamcolor: string;

    constructor(data: IConstructor) {
        this.id = data.id;
        this.name = data.name;
        this.carname = data.carname;
        this.longname = data.longname;
        this.teamcolor = data.teamcolor;
    }
}