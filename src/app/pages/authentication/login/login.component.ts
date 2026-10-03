import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterLink } from '@angular/router';
import { AuthService, FormToolsService } from '@services';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CombinedGraphQLErrors } from '@apollo/client/core';

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
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styles: ``,
})
export class LoginComponent {
  private readonly router = inject(Router);

  private readonly _authService = inject(AuthService);

  public readonly formTools = inject(FormToolsService);

  public loading = signal(false);
  public showPassword = signal(false);

  public formGroup = this.formTools.builder.group({
    password: ['', [Validators.required]],
    username: [this._authService.username, [Validators.required]],
    rememberMe: [false],
  });

  public togglePasswordVisibility() {
    this.showPassword.update((current) => !current);
  }

  public submit() {
    this.loading.set(true);

    if (this.formGroup.valid) {
      const values = this.formGroup.getRawValue() as any;

      const { username, password, rememberMe } = values;

      if (rememberMe) {
        this._authService.username = username;
      }

      this._authService.signIn({ username, password }).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/']);
        },
        error: (err) => {
          const statusCode = readStatusCode(err);

          if (statusCode === 401) {
            this.formGroup.get('password')?.setErrors({
              unauthenticated: true,
            });
          }

          if (statusCode === 409) {
            this.formGroup.get('username')?.setErrors({
              userNotFound: true,
            });
          }

          this.loading.set(false);
        },
      });
    }
  }
}
