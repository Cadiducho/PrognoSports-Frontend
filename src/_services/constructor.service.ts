import axios from "axios";
import {Constructor, IConstructor} from "@/types/Constructor";
import {PrognoService} from "@/_services/progno.service";
import {Season} from "@/types/Season";

export class ConstructorService extends PrognoService<IConstructor, Constructor> {

    factory(data: IConstructor): Constructor {
        return new Constructor(data);
    }

    /**
     * Devuelve un constructor
     * @param sessionName el nombre del constructor
     */
    public async getConstructor(constructorName: string): Promise<Constructor> {
        return this.getObjectFromAPI(`/constructors/${constructorName}`)
    }

    /**
     * Devuelve la lista total de constructores
     */
    public async getAllConstructors(): Promise<Array<Constructor>> {
        return this.getObjectListFromAPI(`/constructors`)
    }

    /**
     * Obtener la lista de constructores que participan en una temporada
     * @param season la temporada
     */
    public async getConstructorsInSeason(season: Season): Promise<Array<Constructor>> {
        return this.getObjectListFromAPI(`/seasons/${season.id}/constructors`);
    }

    public async createConstructor(data: {name: string}): Promise<Constructor> {
        return await axios.post(`/constructors`, data);
    }

    public async updateConstructor(constructor: Constructor): Promise<Array<Constructor>> {
        return await axios.put(`/constructors/${constructor.id}`, constructor);
    }

    public async deleteConstructor(constructor: Constructor): Promise<Array<Constructor>> {
        return await axios.delete(`/constructors/${constructor.id}`);
    }
}
