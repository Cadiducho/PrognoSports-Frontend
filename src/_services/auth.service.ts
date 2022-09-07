import axios from "axios";
import {AuthToken, IAuthToken} from "@/types/AuthToken";
import {CircuitVariant} from "@/types/CircuitVariant";

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
        return new Promise((resolve, reject) => {
            axios.get('/auth/tokens').then((data => {
                const tokenData = data as unknown as IAuthToken[];
                resolve(tokenData.map(t => new AuthToken(t)));
            }));
        })
    }

    public async deleteOneAuthToken(token: AuthToken): Promise<Array<AuthToken>> {
        return axios.delete(`/auth/tokens/${token.token}`);
    }

    public async deleteAuthTokens(): Promise<Array<AuthToken>> {
        return axios.delete('/auth/tokens');
    }
}