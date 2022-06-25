import axios from "axios";

export abstract class PrognoService<In, T extends In> {

    /**
     * Método para fabricar la instancia del tipo T a partir de una interface In
     * @param data Interfaz de datos de la API
     */
    abstract factory(data: In): T;

    /**
     * Obtiene el objeto de datos a partir de la API
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
     * Crea el objeto de datos en la API
     * @param endpoint ruta de la API
     */
    public async postObjectToAPI(endpoint: string, data: any): Promise<T> {
        return new Promise(((resolve, reject) => {
            this.postToAPI(endpoint, data).then(obj => {
                resolve(this.factory(obj));
            }).catch(reason => reject(reason));
        }));
    }

    /**
     * Actualiza el objeto de datos a partir de la API
     * @param endpoint ruta de la API
     */
    public async putObjectToAPI(endpoint: string, data: any): Promise<T> {
        return new Promise(((resolve, reject) => {
            this.putToAPI(endpoint, data).then(obj => {
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
     * Crea una interfaz de datos en la API mediante POST
     * @param endpoint ruta de la API
     */
    private async postToAPI(endpoint: string, data: any): Promise<In> {
        return await axios.post(endpoint, data);
    }

    /**
     * Actualiza una interfaz de datos a de la API mediante PUT
     * @param endpoint ruta de la API
     */
    private async putToAPI(endpoint: string, data: any): Promise<In> {
        return await axios.put(endpoint, data);
    }

    /**
     * Obtiene la lista de interfaces de datos a partir de la API
     * @param endpoint ruta de la API
     */
    private async getListFromAPI(endpoint: string): Promise<Array<In>> {
        return await axios.get(endpoint);
    }
}