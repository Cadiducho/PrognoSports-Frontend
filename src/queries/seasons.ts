import {defineQueryOptions, useMutation, useQueryCache} from "@pinia/colada";
import {seasonService} from "@/_services";
import type {Season} from "@/types/Season";

/** Raíz de las claves de las temporadas. Invalidarla refresca cualquier consulta de temporadas que esté en uso. */
export const SEASONS_KEY = ['seasons'] as const;

/** Todas las temporadas. No depende del usuario, así que todas las pantallas comparten la misma entrada */
export const seasonListQuery = defineQueryOptions({
  key: [...SEASONS_KEY, 'list'],
  query: () => seasonService.getSeasonList(),
});

/** Crear, editar o eliminar una temporada cambia la lista: se invalida y las pantallas que la usan la vuelven a pedir */
function useInvalidateSeasons() {
  const queryCache = useQueryCache();
  return () => queryCache.invalidateQueries({key: SEASONS_KEY});
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
