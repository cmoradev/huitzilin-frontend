/**
 * Estructura del formulario para crear o actualizar una cuenta CLIP.
 *
 * Refleja los campos requeridos por `CreateClipAccount` / `UpdateClipAccount`.
 */
export interface ClipAccountFormFields {
  name: string;
  token: string;
  webhook: string;
  default: string;
  success: string;
  error: string;
}