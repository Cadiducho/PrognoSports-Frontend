import axios from "axios";

/**
 * Helpers de lectura y escritura para convertir la respuesta de la API (DTO) en el tipo de dominio.
 * El interceptor de axios (ver index.ts) ya desenvuelve la respuesta, por eso se tipa como el DTO.
 */

export async function getObject<Dto, T = Dto>(endpoint: string, map?: (dto: Dto) => T): Promise<T> {
  const dto = await axios.get(endpoint) as unknown as Dto;
  return map ? map(dto) : dto as unknown as T;
}

export async function getObjectList<Dto, T = Dto>(endpoint: string, map?: (dto: Dto) => T): Promise<Array<T>> {
  const dtos = await axios.get(endpoint) as unknown as Array<Dto>;
  return map ? dtos.map(dto => map(dto)) : dtos as unknown as Array<T>;
}

export async function postObject<Dto, T = Dto>(endpoint: string, data: unknown, map?: (dto: Dto) => T): Promise<T> {
  const dto = await axios.post(endpoint, data) as unknown as Dto;
  return map ? map(dto) : dto as unknown as T;
}
