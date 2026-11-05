import {defineQueryOptions, useMutation, useQueryCache} from "@pinia/colada";
import {seasonService} from "@/_services";
import type {Season} from "@/types/Season";
import {fetchEntryData} from "@/queries/fetchEntry";

/** Raíz de las claves de las temporadas. Invalidarla refresca cualquier consulta de temporadas que esté en uso. */
export const SEASONS_KEY = ['seasons'] as const;

/** Todas las temporadas. No depende del usuario, así que todas las pantallas comparten la misma entrada */
export const seasonListQuery = defineQueryOptions({
  key: [...SEASONS_KEY, 'list'],
  query: () => seasonService.getSeasonList(),
});

/**
 * La lista de temporadas para código que la necesita dentro de otra carga, donde no se puede usar `useQuery`.
 * Lee y rellena la misma entrada de la caché que `seasonListQuery`: solo la pide si no está o ya no está fresca.
 */
export async function fetchSeasonList(): Promise<Array<Season>> {
  const queryCache = useQueryCache();
  return fetchEntryData(queryCache, queryCache.ensure(seasonListQuery));
}

/**
 * Crear, editar o eliminar una temporada cambia la lista: se invalida y las pantallas que la usan la vuelven a pedir.
 * No devuelve la promesa: Pinia Colada espera a onSettled, y la mutación no debe esperar a ese refresco ni darse por
 * fallida si falla.
 */
function useInvalidateSeasons() {
  const queryCache = useQueryCache();
  return (): void => {
    queryCache.invalidateQueries({key: SEASONS_KEY}).catch(() => undefined);
  };
}

export function useCreateSeason() {
  const invalidateSeasons = useInvalidateSeasons();
  return useMutation({
    mutation: (data: Parameters<typeof seasonService.createSeason>[0]) => seasonService.createSeason(data),
    onSettled: invalidateSeasons,
  });
}

export function useEditSeason() {
  const invalidateSeasons = useInvalidateSeasons();
  return useMutation({
    mutation: (vars: { season: Season, data: Parameters<typeof seasonService.editSeason>[1] }) => seasonService.editSeason(vars.season, vars.data),
    onSettled: invalidateSeasons,
  });
}

export function useDeleteSeason() {
  const invalidateSeasons = useInvalidateSeasons();
  return useMutation({
    mutation: (season: Season) => seasonService.deleteSeason(season),
    onSettled: invalidateSeasons,
  });
}
