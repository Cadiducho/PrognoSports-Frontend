import axios from 'axios';
import VueAxios from 'vue-axios';
import Vue from "vue";
import {SeasonService} from "@/_services/season.service";

Vue.use(VueAxios, axios);

function authHeader() {
    let token = localStorage.getItem('user-token');

    if (token) {
        return token;
    } else {
        return '';
    }
}

axios.defaults.baseURL = 'https://prognosports.com/api/v2';
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
export * from './user.service';
export * from './community.service';
export * from './notification.service';
export * from './grandprix.service';
export * from './drivers.service';
export const seasonService = new SeasonService();