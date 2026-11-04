import axios from "axios";
import {Constructor, IConstructor} from "@/types/Constructor";
import {PrognoService} from "@/_services/progno.service";
import {Season} from "@/types/Season";
import {SeasonMembership, loadSeasonMemberships} from "@/_services/seasonMembership";

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

  /**
   * Crea un constructor. Devuelve el constructor con su id generado.
   */
  public async createConstructor(data: { name: string }): Promise<Constructor> {
    return this.postObjectToAPI(`/constructors`, data);
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
  public async getConstructorInSeason(seasonId: string | number, constructorId: string | number): Promise<Constructor> {
    return this.getObjectFromAPI(`/seasons/${seasonId}/constructors/${constructorId}`)
  }

  /**
   * Enlazar un constructor a una temporada
   * @param seasonId La temporada
   * @param data Los datos del constructor
   */
  public async linkConstructorToSeason(seasonId: string | number, data: {
    car: string;
    constructorId: number;
    teamcolor: string;
    fullname: string
  }): Promise<Constructor> {
    return await axios.post(`/seasons/${seasonId}/constructors`, data);
  }

  public async updateConstructorInSeason(seasonId: string, constructor: {id: number, car: string, fullname: string, teamcolor: string}): Promise<Array<Constructor>> {
    return await axios.put(`/seasons/${seasonId}/constructors/${constructor.id}`, constructor);
  }

  public async deleteConstructorFromSeason(seasonId: string | number, constructor: Pick<Constructor, "id">): Promise<Array<Constructor>> {
    return await axios.delete(`/seasons/${seasonId}/constructors/${constructor.id}`);
  }

  /**
   * Temporadas en las que participa un constructor
   */
  public async getSeasonsOfConstructor(constructorId: number): Promise<Array<Season>> {
    return await axios.get(`/constructors/${constructorId}/seasons`);
  }

  /**
   * Temporadas en las que participa un constructor, con sus datos en cada una (coche, nombre largo y color)
   */
  public async getSeasonMembershipsOfConstructor(constructorId: number): Promise<Array<SeasonMembership<Constructor>>> {
    const seasons = await this.getSeasonsOfConstructor(constructorId);
    return loadSeasonMemberships(seasons, season => this.getConstructorInSeason(season.id, constructorId));
  }
}
