import axios from 'axios';

export const userService = {
    login,
    getMe,
    register,
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

function register(email, username, password) {
    return axios
        .post('/register', {
            "email": email,
            "username": username,
            "password": password
        });
}