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
   * @param constructorId el id del constructor
   */
  public async getConstructor(constructorId: string): Promise<Constructor> {
    return this.getObjectFromAPI(`/constructors/${constructorId}`)
  }

  /**
   * Devuelve la lista total de constructores
   */
  public async getAllConstructors(): Promise<Array<Constructor>> {
    return this.getObjectListFromAPI(`/constructors`)
  }

  public async createConstructor(data: { name: string }): Promise<Constructor> {
    return await axios.post(`/constructors`, data);
  }

  public async updateConstructor(constructor: Partial<Constructor>): Promise<Array<Constructor>> {
    return await axios.put(`/constructors/${constructor.id}`, constructor);
  }

  public async deleteConstructor(constructor: Constructor): Promise<Array<Constructor>> {
    return await axios.delete(`/constructors/${constructor.id}`);
  }

  /**
   * Obtener la lista de constructores que participan en una temporada
   * @param season la temporada
   */
  public async getConstructorsInSeason(season: Season): Promise<Array<Constructor>> {
    return this.getObjectListFromAPI(`/seasons/${season.id}/constructors`);
  }

  /**
   * Devuelve un constructor en una temporada
   * @param constructorId el id del constructor
   */
  public async getConstructorInSeason(seasonId: string, constructorId: string): Promise<Constructor> {
    return this.getObjectFromAPI(`/seasons/${seasonId}/constructors/${constructorId}`)
  }

  /**
   * Enlazar un constructor a una temporada
   * @param seasonId La temporada
   * @param data Los datos del constructor
   */
  public async linkConstructorToSeason(seasonId: string, data: {
    car: string;
    constructor: number;
    teamcolor: string;
    fullname: string
  }) {
    return await axios.post(`/seasons/${seasonId}/constructors`, data);
  }

  public async updateConstructorInSeason(seasonId: string, constructor: Partial<Constructor>): Promise<Array<Constructor>> {
    return await axios.put(`/seasons/${seasonId}/constructors/${constructor.id}`, constructor);
  }

  public async deleteConstructorFromSeason(seasonId: string, constructor: Constructor): Promise<Array<Constructor>> {
    return await axios.delete(`/seasons/${seasonId}/constructors/${constructor.id}`);
  }
}
