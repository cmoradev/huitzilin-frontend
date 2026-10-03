/**
 * Estructura del formulario para crear o actualizar un estudiante.
 */
export interface StudentFormFields {
  picture: File | string;
  firstname: string;
  lastname: string;
  dni: string;
  /** Fecha de nacimiento en formato YYYY-MM-DD. */
  dateBirth: string;
  active: boolean;
  branchIds: string[];
}