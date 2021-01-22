import axios from "axios";

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
}