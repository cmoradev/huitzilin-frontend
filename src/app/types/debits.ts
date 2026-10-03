import { DebitState, DiscountBy, Frequency } from '@graphql';

/**
 * Estructura de cada descuento aplicado al adeudo.
 */
export interface DebitDiscountFormFields {
  id: string;
  name: string;
  type: DiscountBy;
  value: number;
}

/**
 * Estructura del formulario principal de un adeudo (crear/editar
 * individual).
 */
export interface DebitFormFields {
  description: string;
  unitPrice: number;
  quantity: number;
  amount: number;
  delinquency: number;
  withTax: boolean;
  state: DebitState;
  frequency: Frequency;
  dueDate: string;
  discount: number;
  discounts: DebitDiscountFormFields[];
}

/**
 * Estructura de cada adeudo calculado dinámicamente en los diálogos de
 * "paquete a la medida" y "creación desde catálogo".
 */
export interface CatalogDebitFields extends DebitFormFields {}