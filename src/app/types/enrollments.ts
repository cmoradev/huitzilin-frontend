import { EnrollmentState } from '@graphql';

/**
 * Estructura del formulario para crear o actualizar un paquete (actividad)
 * dentro del módulo de precios.
 */
export interface ActivityFormFields {
  name: string;
}

/**
 * Estructura del formulario para crear o actualizar una inscripción.
 */
export interface EnrollmentFormFields {
  details: string;
  state: EnrollmentState;
  package: string | null;
  level: string | null;
}