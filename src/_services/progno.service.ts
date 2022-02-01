import axios from "axios";

export abstract class PrognoService<In, T extends In> {

    /**
     * Método para fabricar la instancia del tipo T a partir de una interface In
     * @param data Interfaz de datos de la API
     */
    abstract factory(data: In): T;

    /**
     * Obtiene la lista de objetos de datos a partir de la API
     * @param endpoint ruta de la API
     */
    public async getObjectFromAPI(endpoint: string): Promise<T> {
        return new Promise(((resolve, reject) => {
            this.getFromAPI(endpoint).then(obj => {
                resolve(this.factory(obj));
            }).catch(reason => reject(reason));
        }));
    }

    /**
     * Obtiene la lista de objetos de datos a partir de la API
     * @param endpoint ruta de la API
     */
    public async getObjectListFromAPI(endpoint: string): Promise<Array<T>> {
        return new Promise(((resolve, reject) => {
            const list: Array<T> = [];
            this.getListFromAPI(endpoint).then(objects => {
                objects.forEach(obj => {
                    list.push(this.factory(obj));
                })
                resolve(list);
            }).catch(reason => reject(reason));
        }));
    }

    /**
     * Obtiene una interfaz de datos a partir de la API
     * @param endpoint ruta de la API
     */
    private async getFromAPI(endpoint: string): Promise<In> {
        return await axios.get(endpoint);
    }

    /**
     * Obtiene la lista de interfaces de datos a partir de la API
     * @param endpoint ruta de la API
     */
    private async getListFromAPI(endpoint: string): Promise<Array<In>> {
        return await axios.get(endpoint);
    }
}