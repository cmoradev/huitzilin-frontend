import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@services';
import {
  form,
  FormField,
  FormRoot,
  required,
  submit,
  ValidationError,
} from '@angular/forms/signals';
import { MatIconModule } from '@angular/material/icon';
import { CombinedGraphQLErrors } from '@apollo/client/core';
import { firstValueFrom } from 'rxjs';
import { LoginFormFields } from '@app/types/authentication';

interface ErrorExtensions {
  readonly statusCode?: number;
  readonly originalError?: { readonly statusCode?: number };
}

function readStatusCode(err: unknown): number | undefined {
  if (!CombinedGraphQLErrors.is(err)) {
    return undefined;
  }

  const first = err.errors[0];
  const extensions = first?.extensions as ErrorExtensions | undefined;

  return extensions?.statusCode ?? extensions?.originalError?.statusCode;
}

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    FormField,
    FormRoot,
    MatFormFieldModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class LoginComponent {
  private readonly router = inject(Router);

  private readonly _authService = inject(AuthService);

  public showPassword = signal(false);

  public readonly loginModel = signal<LoginFormFields>({
    username: this._authService.username,
    password: '',
    rememberMe: false,
  });

  public readonly loginForm = form(this.loginModel, (schema) => {
    required(schema.username, { message: 'Campo requerido' });
    required(schema.password, { message: 'Campo requerido' });
  });

  public togglePasswordVisibility(): void {
    this.showPassword.update((current) => !current);
  }

  public async submit(): Promise<void> {
    const { username, password, rememberMe } = this.loginModel();

    if (rememberMe) {
      this._authService.username = username;
    }

    await submit(this.loginForm, async () => {
      try {
        await firstValueFrom(
          this._authService.signIn({ username, password })
        );
        this.router.navigate(['/']);
        return;
      } catch (err) {
        const statusCode = readStatusCode(err);

        if (statusCode === 401) {
          this.loginModel.update((current) => ({ ...current, password: '' }));
          const error: ValidationError.WithFieldTree = {
            kind: 'unauthenticated',
            message: 'Credenciales no validas',
            fieldTree: this.loginForm.password,
          };
          throw error;
        }

        if (statusCode === 409) {
          const error: ValidationError.WithFieldTree = {
            kind: 'userNotFound',
            message: 'Usuario no encontrado',
            fieldTree: this.loginForm.username,
          };
          throw error;
        }

        throw {
          kind: 'serverError',
          message: 'No fue posible iniciar sesión',
        };
      }
    });
  }
}