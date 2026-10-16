import {getObject, getObjectList} from "@/_services/api";
import axios from "axios";
import {Circuit, mapCircuit} from "@/types/Circuit";
import {CircuitVariant, CircuitVariantDto, mapCircuitVariant} from "@/types/CircuitVariant";

export class CircuitService {
    public async getCircuitList(): Promise<Array<Circuit>> {
        return getObjectList(`/circuits`, mapCircuit);
    }

    public async getCircuit(circuitId: string): Promise<Circuit> {
        return getObject(`/circuits/${circuitId}`, mapCircuit);
    }

    public async listCircuitVariant(circuit: Circuit): Promise<Array<CircuitVariant>> {
        const circuitData = await axios.get(`/circuits/${circuit.id}/variants`) as CircuitVariantDto[];
        return circuitData.map(mapCircuitVariant);
    }

    public async createCircuit(data: any): Promise<Circuit> {
        return await axios.post(`/circuits`, data)
    }

    public async createCircuitVariant(circuit: Circuit, data: Partial<CircuitVariant>): Promise<CircuitVariant> {
        return await axios.post(`/circuits/${circuit.id}`, data);
    }

    public async editCircuit(circuit: Circuit, data: Partial<Circuit>): Promise<Circuit> {
        return await axios.put(`/circuits/${circuit.id}`, data)
    }

    public async editCircuitVariant(circuit: Circuit, variant: CircuitVariant, data: Partial<CircuitVariant>): Promise<CircuitVariant> {
        return await axios.put(`/circuits/${circuit.id}/${variant.id}`, data)
    }

    public async changeCircuitLogo(circuit: Circuit, blob: Blob | string) {
        const formData = new FormData();
        formData.append('image', blob);
        return await axios.post(`/circuits/${circuit.id}/logo`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }

    public async changeVariantLayout(circuit: Circuit, variant: CircuitVariant, blob: Blob | string) {
        const formData = new FormData();
        formData.append('image', blob);
        return await axios.post(`/circuits/${circuit.id}/${variant.id}/layout`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }

    public async deleteCircuit(circuit: Circuit): Promise<boolean> {
        return await axios.delete(`/circuits/${circuit.id}`)
    }
}