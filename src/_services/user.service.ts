import axios from 'axios';
import {User} from "@/types/User";

export const userService = {
    login,
    getMe,
    getUser,
    register,
    sendForgotPassword,
    changePassword,
    getUsersInCommunity
};

function login(username: string, password: string): Promise<string> {
    return axios
        .post('/auth/login', {
            "username": username,
            "password": password
        });
}

function getMe(): Promise<User> {
    return axios
        .get('/user/me');
}

async function getUser(user: number): Promise<User> {
    return await axios.get(`/user/${user}`);
}

async function getUsersInCommunity(communityId: number): Promise<Array<User>> {
    return await axios.get(`/communities/${communityId}/members`);
}

function register(email: string, username: string, password: string) {
    return axios
        .post('/auth/register', {
            "email": email,
            "username": username,
            "password": password
        });
}

function sendForgotPassword(email: string) {
    return axios.post("/auth/forgotpassword", {"email": email});
}

function changePassword(email: string, inputToken: string, inputPassword: string) {
    return axios.patch("/auth/changepassword", {"email": email, "token": inputToken, "password": inputPassword});
}