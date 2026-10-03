import { Frequency, PaymentMethod } from '@graphql';

/**
 * Estructura del formulario para crear o actualizar una tarifa.
 */
export interface FeeFormFields {
  name: string;
  amount: number;
  frequency: Frequency;
  autoLoad: boolean;
}

/**
 * Estructura de cada pago recibido dentro del diálogo de cobro.
 * El método define qué validaciones condicionales se aplican.
 */
export interface PaymentFormFields {
  method: PaymentMethod;
  amount: number;
  date: string;
  transaction: string;
  bank: string;
}