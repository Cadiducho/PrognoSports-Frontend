import {BASE_URL} from "@/config";
import type {Community} from "@/types/Community";

const DEFAULT_COMMUNITY_IMAGE = 'https://github.com/Cadiducho/PrognoSports-Frontend/blob/develop/src/assets/default_profile_image.jpg?raw=true';

export function communityImageUrl(community: Pick<Community, 'id' | 'hasImage'>): string {
  if (community.hasImage) {
    return BASE_URL + `/communities/${community.id}/image`;
  }

  // ToDo: coger la imagen por defecto de los assets
  return DEFAULT_COMMUNITY_IMAGE;
}
