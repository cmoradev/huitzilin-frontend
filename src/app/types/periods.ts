/**
 * Estructura del formulario para crear o actualizar un período de
 * programación (Period).
 */
export interface PeriodFormFields {
  name: string;
  days: string[];
  start: string;
  end: string;
  firstHour: string;
  lastHour: string;
}