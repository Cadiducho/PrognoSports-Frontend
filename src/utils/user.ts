import {BASE_URL} from "@/config";
import type {User} from "@/types/User";

const DEFAULT_PROFILE_IMAGE = 'https://github.com/Cadiducho/PrognoSports-Frontend/blob/develop/src/assets/default_profile_image.jpg?raw=true';

/**
 * Compara el rango del usuario para determinar si es administrador o no
 * @return True si es administrador
 */
export function isUserAdmin(user: Pick<User, 'rank'>): boolean {
  return user.rank?.name.toLowerCase() === "admin";
}

export function isUserVerified(user: Pick<User, 'verified_at'>): boolean {
  return !!user.verified_at && user.verified_at.getTime() < new Date().getTime();
}

export function userProfileImageUrl(user: Pick<User, 'id' | 'hasProfileImage'>): string {
  if (user.hasProfileImage) {
    return BASE_URL + `/user/${user.id}/image`;
  }

  // ToDo: coger la imagen por defecto de los assets
  return DEFAULT_PROFILE_IMAGE;
}

export function userRankTagStyle(user: Pick<User, 'rank'>) {
  return {
    backgroundColor: '#' + user.rank.color,
    color: 'white',
  }
}
