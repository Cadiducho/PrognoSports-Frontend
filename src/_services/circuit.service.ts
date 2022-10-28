import axios from "axios";
import {Circuit, ICircuit} from '@/types/Circuit';
import {CircuitVariant} from "@/types/CircuitVariant";
import {PrognoService} from "@/_services/progno.service";

export class CircuitService extends PrognoService<ICircuit, Circuit> {

    factory(data: ICircuit): Circuit {
        return new Circuit(data);
    }

    public async getCircuitList(): Promise<Array<Circuit>> {
        return this.getObjectListFromAPI(`/circuits`);
    }

    public async getCircuit(circuitId: string): Promise<Circuit> {
        return this.getObjectFromAPI(`/circuits/${circuitId}`);
    }

    public async getCircuitWithVariant(circuitId: string, variantId: string) : Promise<Circuit> {
        return this.getObjectFromAPI(`/circuits/${circuitId}/${variantId}`);
    }

    public async listCircuitVariant(circuit: Circuit): Promise<Array<CircuitVariant>> {
        const variantList: Array<CircuitVariant> = [];
        return new Promise((resolve, reject) => {
            axios.get(`/circuits/${circuit.id}/variants`).then((data => {
                const variantsData = data as unknown as CircuitVariant[];
                variantsData.forEach(variant => {
                    variantList.push(new CircuitVariant(variant));
                })
                resolve(variantList);
            })).catch(e => reject(e));
        })
    }

    public async createCircuit(data: any): Promise<Circuit> {
        return await axios.post(`/circuits`, data)
    }

}