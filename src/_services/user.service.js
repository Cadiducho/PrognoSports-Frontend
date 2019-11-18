import axios from 'axios';

export const userService = {
    login,
    getMe,
    register,
    sendForgotPassword,
    changePassword,
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

function sendForgotPassword(email) {
    return axios.post("forgotpassword", {"email": email});
}

function changePassword(email, inputToken, inputPassword) {
    return axios.patch("changepassword", {"email": email, "token": inputToken, "password": inputPassword});
}