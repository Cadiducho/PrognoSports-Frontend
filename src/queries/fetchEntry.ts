import type {QueryCache, UseQueryEntry} from "@pinia/colada";

/** Máximo de veces que se vuelve a esperar si otra petición sustituye a la que se estaba esperando */
const MAX_ATTEMPTS = 3;

/**
 * Los datos de una entrada de la caché, para los helpers `fetch*` que se usan dentro de otra carga. Solo pide los datos
 * si no están o ya no están frescos; un fallo de la petición se lanza como excepción.
 *
 * Si mientras se espera la entrada se invalida o se vuelve a pedir, Pinia Colada descarta la petición en curso y
 * `refresh` devuelve el estado que tuviera la entrada (sin datos si era la primera carga). En ese caso se espera a
 * la petición nueva en lugar de devolver datos vacíos.
 */
export async function fetchEntryData<T, TError, TDataInitial extends T | undefined>(
  queryCache: QueryCache,
  entry: UseQueryEntry<T, TError, TDataInitial>,
): Promise<T> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const state = await queryCache.refresh(entry);
    if (state.status === 'success') {
      return state.data;
    }
  }
  throw new Error("No se han podido cargar los datos");
}
