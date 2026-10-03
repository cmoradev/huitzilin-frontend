import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [
    MatCard,
    MatCardContent,
    MatFormField,
    MatInput,
    MatLabel,
    MatHint,
    MatButton
  ],
  templateUrl: './reset-password.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``
})
export class ResetPasswordComponent {
  private readonly router = inject(Router)
  
  public submit() {
    this.router.navigate(['authentication/login'])
  }
}
