import {defineQueryOptions, useMutation, useQueryCache} from "@pinia/colada";
import {communityService} from "@/_services";
import type {CreateCommunityPayload} from "@/_services/community.service";
import type {Community} from "@/types/Community";

/**
 * Raíz de las claves de las comunidades. Invalidarla refresca cualquier consulta de comunidades que esté en uso.
 * Las consultas cuyo resultado depende del usuario (la lista de todas indica a cuáles pertenece) llevan su id en la
 * clave, para que al cambiar de usuario no se reutilice lo del anterior.
 */
export const COMMUNITIES_KEY = ['communities'] as const;

/** Todas las comunidades, indicando en cada una si el usuario es miembro */
export const allCommunitiesQuery = defineQueryOptions((userId: number) => ({
  key: [...COMMUNITIES_KEY, 'all', userId],
  query: () => communityService.getAllCommunities(),
  enabled: userId > 0,
}));

/** Las comunidades a las que pertenece el usuario */
export const userCommunitiesQuery = defineQueryOptions((userId: number) => ({
  key: [...COMMUNITIES_KEY, 'user', userId],
  query: () => communityService.getUserCommunities(userId),
  enabled: userId > 0,
}));

/**
 * Cualquier cambio en las comunidades (crear, unirse, salir) puede alterar las listas, que son las que están en
 * pantalla: se invalidan todas, y las que se estén usando se vuelven a pedir.
 */
function useInvalidateCommunities() {
  const queryCache = useQueryCache();
  return () => queryCache.invalidateQueries({key: COMMUNITIES_KEY});
}

export function useJoinCommunity() {
  const invalidateCommunities = useInvalidateCommunities();
  return useMutation({
    mutation: (vars: { community: Community, code?: string }) => communityService.joinCommunity(vars.community, vars.code),
    onSettled: invalidateCommunities,
  });
}

export function useQuitCommunity() {
  const invalidateCommunities = useInvalidateCommunities();
  return useMutation({
    mutation: (community: Community) => communityService.quitCommunity(community),
    onSettled: invalidateCommunities,
  });
}

export function useCreateCommunity() {
  const invalidateCommunities = useInvalidateCommunities();
  return useMutation({
    mutation: (data: CreateCommunityPayload) => communityService.createCommunity(data),
    onSettled: invalidateCommunities,
  });
}
