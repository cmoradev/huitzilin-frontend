/**
 * Estructura del formulario para crear o actualizar un docente.
 */
export interface TeacherFormFields {
  picture: File | string;
  firstname: string;
  lastname: string;
  branchIds: string[];
}