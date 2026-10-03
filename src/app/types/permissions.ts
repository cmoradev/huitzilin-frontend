import { PermissionKey } from '@routes';

/**
 * Estructura del formulario para crear o actualizar un permiso dentro
 * de una política.
 */
export interface ActionFormFields {
  id: string | null;
  route: string;
  /** Identificadores de permisos seleccionados (mat-checkboxes). */
  actions: PermissionKey[];
  /** Identificadores de sucursales o el comodín `*` para rutas globales. */
  resources: string[];
}