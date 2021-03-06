import axios from 'axios';
import Vue from "vue";
import {SeasonService} from "@/_services/season.service";
import {UserService} from "@/_services/user.service";
import {CommunityService} from "@/_services/community.service";
import {NotificationService} from "@/_services/notification.service";
import {GrandprixService} from "@/_services/grandprix.service";
import {DriversService} from "@/_services/drivers.service";
import {CircuitService} from './circuit.service';
import {AuthService} from "@/_services/auth.service";
import {ScoreService} from "@/_services/score.service";

function authHeader() {
    let token = localStorage.getItem('user-token');

    if (token) {
        return token;
    } else {
        return '';
    }
}

axios.defaults.baseURL = process.env.NODE_ENV === 'production'
    ? 'https://api.prognosports.com/v2'
    : 'https://nightly.prognosports.com/v2';

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
            let error = {
                code: data.code,
                message: data.message
            }
            return Promise.reject(error);
        }
    }
    return response;
});

// API Services
export const authService = new AuthService();
export const userService = new UserService();
export const communityService = new CommunityService();
export const notificationService = new NotificationService();
export const grandPrixService = new GrandprixService();
export const driversService = new DriversService();
export const seasonService = new SeasonService();
export const scoreService = new ScoreService();
export const circuitService = new CircuitService();