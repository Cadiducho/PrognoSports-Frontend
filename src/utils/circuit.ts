import type {RouteLocationRaw} from "vue-router";
import {BASE_URL} from "@/config";
import type {Circuit} from "@/types/Circuit";
import type {CircuitVariant} from "@/types/CircuitVariant";

const DEFAULT_CIRCUIT_IMAGE = 'https://github.com/Cadiducho/PrognoSports-Frontend/blob/develop/src/assets/default_profile_image.jpg?raw=true';

export function circuitLink(circuit: Pick<Circuit, 'id'>): RouteLocationRaw {
  return {
    name: 'circuitDetails',
    params: {circuit: circuit.id}
  };
}

/** La variante por defecto de un circuito es la que se llama "GrandPrix" */
export function isDefaultCircuitVariant(variant: Pick<CircuitVariant, 'name'>): boolean {
  return variant.name == 'GrandPrix';
}

/**
 * Imagen del layout de una variante
 * @param variant La variante
 * @param force Pedir la imagen aunque la variante no indique que tenga una
 */
export function circuitVariantLayoutImageUrl(variant: Pick<CircuitVariant, 'id' | 'circuitId' | 'hasLayoutImage'>, force: boolean = false): string {
  if (force || variant.hasLayoutImage) {
    return BASE_URL + `/circuits/${variant.circuitId}/${variant.id}/layout`;
  }

  // ToDo: coger la imagen por defecto de los assets
  return DEFAULT_CIRCUIT_IMAGE;
}

/**
 * Imagen del layout de un circuito: la de la variante indicada o, si no se indica, la de la primera
 * @param variantIndex Posición de la variante en la lista de variantes del circuito (no su id)
 */
export function circuitLayoutImageUrl(circuit: Pick<Circuit, 'variants'>, variantIndex?: number): string {
  const variant = variantIndex ? circuit.variants[variantIndex] : circuit.variants[0];
  if (variant) {
    return circuitVariantLayoutImageUrl(variant);
  }

  // ToDo: coger la imagen por defecto de los assets
  return DEFAULT_CIRCUIT_IMAGE;
}

export function circuitLogoImageUrl(circuit: Pick<Circuit, 'id' | 'hasLogoImage' | 'variants'>): string {
  if (circuit.hasLogoImage) {
    return BASE_URL + `/circuits/${circuit.id}/logo`;
  }

  return circuitLayoutImageUrl(circuit);
}
