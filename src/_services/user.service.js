import axios from 'axios';

export const userService = {
    login,
    getMe,
};

function login(username, password) {
    return axios
        .post('/login', {
            "username": username,
            "password": password
        });
}

function getMe() {
    return axios
        .get('/user/me');
}