import {computed, ref, watch} from "vue";
import {useQuery} from "@pinia/colada";
import {seasonListQuery} from "@/queries/seasons";
import type {Season} from "@/types/Season";

/**
 * La lista de temporadas y la temporada elegida en un selector.
 *
 * La temporada se elige una sola vez, cuando llegan las temporadas (o al instante si ya están en la caché). Las
 * actualizaciones posteriores de la lista no cambian la elección del usuario.
 *
 * @param preferredId Id de la temporada que debe quedar elegida. Si no se indica, se elige la última.
 */
export function useSeasonSelection(preferredId?: number) {
  const {data, isPending} = useQuery(seasonListQuery);

  const seasonList = computed<Array<Season>>(() => data.value ?? []);
  const chosenSeason = ref<Season>({} as Season);

  watch(seasonList, (list) => {
    if (chosenSeason.value.id || list.length === 0) {
      return;
    }
    const season = preferredId === undefined ? list[list.length - 1] : list.find((s) => s.id === preferredId);
    if (season) {
      chosenSeason.value = season;
    }
  }, {immediate: true});

  return {seasonList, chosenSeason, isPending};
}
