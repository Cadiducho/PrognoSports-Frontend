import axios from "axios";
import {AuthToken, IAuthToken} from "@/types/AuthToken";

export class AuthService {

    public async login(username: string, password: string): Promise<string> {
        return await axios
            .post('/auth/login', {
                "username": username,
                "password": password
            });
    }

    public async register(email: string, username: string, password: string): Promise<string> {
        return await axios
            .post('/auth/register', {
                "email": email,
                "username": username,
                "password": password
            });
    }

    public async getAuthTokens(): Promise<Array<AuthToken>> {
        const tokenData = await axios.get(`/auth/tokens`) as IAuthToken[];
        return tokenData.map(data => new AuthToken(data));
    }

    public async deleteOneAuthToken(token: AuthToken): Promise<Array<AuthToken>> {
        return axios.delete(`/auth/tokens/${token.token}`);
    }

    public async deleteAuthTokens(): Promise<Array<AuthToken>> {
        return axios.delete('/auth/tokens');
    }
}