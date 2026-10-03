/**
 * Estructura del formulario para crear o actualizar un usuario.
 */
export interface UserFormFields {
  username: string;
  password: string;
  email: string;
  branchId: string | null;
  cycleId: string | null;
}