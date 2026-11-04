import {Circuit} from "@/types/Circuit";
import {isFilled, isHexColor, isIntAtLeast, isIntInRange} from "@/utils/adminValidators";

/**
 * Datos de cada tipo de enlace con una temporada, con su valor inicial, su validación y el payload que
 * espera el backend. Los usan los wizards de creación y las páginas "añadir a la temporada".
 */

// Piloto ↔ temporada: dorsal y color
export interface DriverSeasonModel {
  number: number | undefined;
  color: string;
}

export const emptyDriverSeasonModel = (): DriverSeasonModel => ({number: undefined, color: ''});

export const isDriverSeasonModelValid = (model: DriverSeasonModel): boolean =>
  isIntInRange(model.number, 0, 99) && isHexColor(model.color);

export const driverSeasonPayload = (driverId: number, model: DriverSeasonModel) => ({
  driver: driverId,
  number: model.number as number,
  color: normalizeColor(model.color),
});

// Constructor ↔ temporada: nombre largo, coche y color
export interface ConstructorSeasonModel {
  fullname: string;
  car: string;
  teamcolor: string;
}

export const emptyConstructorSeasonModel = (fullname = ''): ConstructorSeasonModel => ({fullname, car: '', teamcolor: ''});

export const isConstructorSeasonModelValid = (model: ConstructorSeasonModel): boolean =>
  isFilled(model.fullname) && isFilled(model.car) && isHexColor(model.teamcolor);

export const constructorSeasonPayload = (constructorId: number, model: ConstructorSeasonModel) => ({
  constructorId,
  fullname: model.fullname.trim(),
  car: model.car.trim(),
  teamcolor: normalizeColor(model.teamcolor),
});

// Gran premio ↔ temporada: circuito, variante, vueltas y ronda
export interface GrandPrixSeasonModel {
  circuit: Circuit | undefined;
  variantId: number | undefined;
  laps: number | undefined;
  round: number | undefined;
}

export const emptyGrandPrixSeasonModel = (): GrandPrixSeasonModel =>
  ({circuit: undefined, variantId: undefined, laps: undefined, round: undefined});

export const isGrandPrixSeasonModelValid = (model: GrandPrixSeasonModel): boolean =>
  !!model.circuit?.id && model.variantId != undefined && isIntAtLeast(model.laps) && isIntAtLeast(model.round);

export const grandPrixSeasonPayload = (gpId: number, model: GrandPrixSeasonModel) => ({
  gp: gpId,
  circuit: model.circuit!.id,
  variant: model.variantId!,
  laps: model.laps!,
  round: model.round!,
});

/** El backend espera el color con `#` */
function normalizeColor(color: string): string {
  const value = color.trim();
  return value.startsWith('#') ? value : `#${value}`;
}
