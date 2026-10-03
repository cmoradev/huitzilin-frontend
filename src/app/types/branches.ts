/**
 * Estructura del formulario para crear o actualizar una sucursal.
 */
export interface BranchFormFields {
  picture: File | string;
  name: string;
  clipAccountID: string | null;
}