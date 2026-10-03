import { DiscountBy } from '@graphql';

/**
 * Estructura del formulario para crear o actualizar un descuento.
 *
 * Mantiene la misma forma que espera la API (`CreateDiscount` / `UpdateDiscount`)
 * pero acoplada al control tipado de Signal Forms.
 */
export interface DiscountFormFields {
  name: string;
  value: number;
  type: DiscountBy;
}

/**
 * Estructura del diálogo para seleccionar un descuento aplicable al
 * adeudo.
 */
export interface SelectDiscountFormFields {
  discountId: string | null;
}