import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';

@Component({
  selector: 'app-blank',
  imports: [RouterOutlet, MatSidenavContainer, MatSidenavContent],
  templateUrl: './blank.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class BlankComponent {}
