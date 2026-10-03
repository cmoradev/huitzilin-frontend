/**
 * Estructura del formulario de inicio de sesión.
 *
 * `username` y `password` se inicializan desde el estado persistido y la API,
 * respectivamente.
 */
export interface LoginFormFields {
  username: string;
  password: string;
  rememberMe: boolean;
}