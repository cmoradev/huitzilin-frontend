import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Reports } from './reports.data';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-reports',
  imports: [MatCardModule, MatIconModule, MatButtonModule, RouterLink, NgClass],
  templateUrl: './reports.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class ReportsComponent {
  public reports = Reports;
}
