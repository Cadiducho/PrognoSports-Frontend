import axios from "axios";
import {Constructor} from "@/types/Constructor";

export class ConstructorService {

    public async getAllConstructors(): Promise<Array<Constructor>> {
        return await axios.get(`/constructors`);
    }

    public async getConstructor(constructor: string): Promise<Array<Constructor>> {
        return await axios.get(`/constructors/${constructor}`);
    }

    public async createConstructor(data: any): Promise<Constructor> {
        return await axios.post(`/constructors`, data);
    }

    public async updateConstructor(constructor: Constructor): Promise<Array<Constructor>> {
        return await axios.put(`/constructors/${constructor.id}`, constructor);
    }

    public async deleteConstructor(constructor: Constructor): Promise<Array<Constructor>> {
        return await axios.delete(`/constructors/${constructor.id}`);
    }
}
