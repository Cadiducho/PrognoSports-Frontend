import axios from 'axios';
import VueAxios from 'vue-axios';
import Vue from "vue";
import {SeasonService} from "@/_services/season.service";
import {UserService} from "@/_services/user.service";
import {CommunityService} from "@/_services/community.service";
import {NotificationService} from "@/_services/notification.service";
import {GrandprixService} from "@/_services/grandprix.service";
import {DriversService} from "@/_services/drivers.service";

Vue.use(VueAxios, axios);

function authHeader() {
    let token = localStorage.getItem('user-token');

    if (token) {
        return token;
    } else {
        return '';
    }
}

axios.defaults.baseURL = 'http://localhost:8000/api/v2';
axios.interceptors.request.use(function (config) {
    const token = authHeader();
    config.headers.Authorization =  token;

    return config;
});

axios.interceptors.response.use(function (response) {
    if (response.data) {
        let data = response.data;
        if (data.success) {
            return data.result;
        } else {
            return Promise.reject(data.message);
        }
    }
    return response;
});

// API Services
export const userService = new UserService();
export const communityService = new CommunityService();
export const notificationService = new NotificationService();
export const grandPrixService = new GrandprixService();
export const driversService = new DriversService();
export const seasonService = new SeasonService();