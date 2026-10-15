import type {RouteLocationRaw} from "vue-router";
import {BASE_URL} from "@/config";
import type {GrandPrix} from "@/types/GrandPrix";

const DEFAULT_PROMO_IMAGE = 'https://github.com/Cadiducho/PrognoSports-Frontend/blob/develop/src/assets/default_profile_image.jpg?raw=true';

/** Fecha de la primera sesión del Gran Premio. Es una fecha inválida si no tiene sesiones */
export function grandPrixFirstDate(gp: Pick<GrandPrix, 'sessions'>): Date {
  return new Date(Math.min(...gp.sessions.map(ses => ses.date.getTime())));
}

/** Fecha de la última sesión del Gran Premio. Es una fecha inválida si no tiene sesiones */
export function grandPrixLastDate(gp: Pick<GrandPrix, 'sessions'>): Date {
  return new Date(Math.max(...gp.sessions.map(ses => ses.date.getTime())));
}

export function grandPrixLink(gp: Pick<GrandPrix, 'id' | 'competition' | 'season'>): RouteLocationRaw {
  return {
    name: "gpdetails",
    params: {
      competition: gp.competition.code,
      season: gp.season.name,
      gp: gp.id,
    }
  };
}

export function grandPrixPromoImageUrl(gp: Pick<GrandPrix, 'id' | 'competition' | 'season' | 'hasPromoImage'>): string {
  if (gp.hasPromoImage) {
    return BASE_URL + `/gps/${gp.competition.code}/${gp.season.name}/${gp.id}/image`;
  }

  // ToDo: coger la imagen por defecto de los assets
  return DEFAULT_PROMO_IMAGE;
}
