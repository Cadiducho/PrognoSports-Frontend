import axios from 'axios';
import {SeasonService} from "@/_services/season.service";
import {UserService} from "@/_services/user.service";
import {CommunityService} from "@/_services/community.service";
import {NotificationService} from "@/_services/notification.service";
import {GrandprixService} from "@/_services/grandprix.service";
import {DriversService} from "@/_services/drivers.service";
import {CircuitService} from './circuit.service';
import {AuthService} from "@/_services/auth.service";
import {ScoreService} from "@/_services/score.service";
import {CompetitionService} from "@/_services/competition.service";
import {ConstructorService} from "@/_services/constructor.service";
import {RuleSetService} from "@/_services/ruleset.service";
import {SessionService} from "@/_services/session.service";

function authHeader() {
  return localStorage.getItem('token') || '';
}

const DEVELOP_BASE_URL = 'https://api.prognosports.com/v2'
const PRODUCTION_BASE_URL = 'https://api.prognosports.com/v2'
export const BASE_URL = import.meta.env.NODE_ENV === 'production' ? PRODUCTION_BASE_URL : DEVELOP_BASE_URL;
axios.defaults.baseURL = BASE_URL;

axios.interceptors.request.use(function (config) {
  config.headers!.Authorization = authHeader();

  return config;
});

axios.interceptors.response.use((response) => {
  if (response.data) {
    const data = response.data;
    if (data.success) {
      return data.result;
    } else {
      return Promise.reject(data);
    }
  }
  return response;
}, error => {
  const payload = {
    message: error.response?.data?.message
  }
  return Promise.reject(payload);
});

// API Services
export const authService = new AuthService();
export const userService = new UserService();
export const communityService = new CommunityService();
export const rulesetService = new RuleSetService();
export const competitionService = new CompetitionService();
export const constructorService = new ConstructorService();
export const circuitService = new CircuitService();
export const notificationService = new NotificationService();
export const grandPrixService = new GrandprixService();
export const driversService = new DriversService();
export const seasonService = new SeasonService();
export const sessionService = new SessionService();
export const scoreService = new ScoreService();
