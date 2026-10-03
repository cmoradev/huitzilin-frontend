import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot',
  imports: [
    MatCard,
    MatCardContent,
    MatFormField,
    MatInput,
    MatLabel,
    MatHint,
    MatButton,
    RouterLink
  ],
  templateUrl: './forgot.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``
})
export class ForgotComponent {
  private readonly router = inject(Router)
  
  public submit() {
    this.router.navigate(['/authentication/reset-password'])
  }
}
