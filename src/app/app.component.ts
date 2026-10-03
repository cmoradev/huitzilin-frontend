import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@services';
import Decimal from 'decimal.js';

import { setDefaultOptions } from 'date-fns';
import { es } from 'date-fns/locale'

setDefaultOptions({
  locale: es,
})

Decimal.set({
  precision: 14,
  rounding: Decimal.ROUND_HALF_UP,
});

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class AppComponent {
  private readonly _iconRegistry = inject(MatIconRegistry);
  private readonly _sanitizer = inject(DomSanitizer);
  private readonly _authService = inject(AuthService);

  constructor() {
    this._iconRegistry.addSvgIconSet(
      this._sanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg')
    );

    this._authService.restoreSession();
  }
}
