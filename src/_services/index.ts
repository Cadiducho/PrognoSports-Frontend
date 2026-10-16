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
import {BASE_URL} from "@/config";

/** Error con el que se rechazan las peticiones: el mensaje de la API y el estado (HTTP o el del cuerpo de la respuesta) */
export interface ApiError {
  message?: string;
  status?: number;
}

// El token y la reacción a un 401 los aporta la sesión (ver src/session.ts): los servicios no conocen los stores
let tokenProvider: () => string | null = () => null;
let unauthorizedHandler: (() => void) | undefined;

export function setTokenProvider(provider: () => string | null) {
  tokenProvider = provider;
}

export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler;
}

/**
 * Avisa de un 401. El login queda fuera porque responde 401 con credenciales inválidas.
 * Cambiar el email o la contraseña también responden 401 si la contraseña es incorrecta, así que un 401 no implica
 * que la sesión haya caducado: el manejador lo comprueba.
 */
function notifyUnauthorized(status: number | undefined, url: string | undefined) {
  if (status === 401 && !url?.includes('/auth/login')) {
    unauthorizedHandler?.();
  }
}

axios.defaults.baseURL = BASE_URL;

axios.interceptors.request.use(function (config) {
  config.headers!.Authorization = tokenProvider() ?? '';

  return config;
});

axios.interceptors.response.use((response) => {
  if (response.data) {
    const data = response.data;
    if (data.success) {
      return data.result;
    } else {
      // La API responde con success=false y el estado en el cuerpo, a veces con un HTTP 200 (p.ej. un token inválido)
      notifyUnauthorized(data.status, response.config?.url);
      return Promise.reject(data);
    }
  }
  return response;
}, error => {
  const status: number | undefined = error.response?.status ?? error.response?.data?.status;
  notifyUnauthorized(status, error.config?.url);
  const payload: ApiError = {
    message: error.response?.data?.message,
    status,
  };
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
