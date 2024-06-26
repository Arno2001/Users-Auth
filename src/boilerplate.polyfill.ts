import "source-map-support/register";
/**
 * Defines a type `Uuid` for strings conforming to UUID format with a unique `_uuidBrand`.
 */
declare global {
  export type Uuid = string & { _uuidBrand: undefined };
}
