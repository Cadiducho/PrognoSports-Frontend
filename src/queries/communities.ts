import {defineQueryOptions, useMutation, useQueryCache} from "@pinia/colada";
import {communityService} from "@/_services";
import type {CreateCommunityPayload} from "@/_services/community.service";
import type {Community} from "@/types/Community";
import type {CommunityUser} from "@/types/CommunityUser";

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

/**
 * Una comunidad por su id o su nombre. Lleva el id del usuario en la clave porque indica si es miembro (`user_is_member`).
 */
export const communityQuery = defineQueryOptions(({userId, idOrName}: { userId: number, idOrName: string | number }) => ({
  key: [...COMMUNITIES_KEY, 'detail', userId, String(idOrName)],
  query: () => communityService.getCommunityById(idOrName),
  enabled: userId > 0,
}));

/**
 * Los miembros de una comunidad. También depende del usuario: lo que puede hacer con cada miembro
 * (`can_kick_users`...) es relativo a quien consulta. Unirse o salir de una comunidad lo invalida, ya que cuelga de la
 * misma raíz de claves.
 */
export const communityMembersQuery = defineQueryOptions(({userId, communityId}: { userId: number, communityId: number }) => ({
  key: [...COMMUNITIES_KEY, 'members', userId, communityId],
  query: () => communityService.getMembers(communityId),
  enabled: userId > 0 && communityId > 0,
}));

/**
 * Los miembros de una comunidad, para código que los pide dentro de otras cargas (`Promise.all`) y no puede usar
 * `useQuery`. Comparte la entrada de la caché con `communityMembersQuery`: devuelve lo que haya si está fresco, y si no
 * lo pide. Rechaza si la petición falla.
 */
export async function fetchCommunityMembers(userId: number, communityId: number): Promise<Array<CommunityUser>> {
  const queryCache = useQueryCache();
  const entry = queryCache.ensure(communityMembersQuery({userId, communityId}));
  const state = await queryCache.refresh(entry);
  if (state.status === 'error') {
    throw state.error;
  }
  return state.data ?? [];
}

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
export function useInvalidateCommunities() {
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
