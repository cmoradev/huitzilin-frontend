import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DebitPartsFragment, DebitState } from '@graphql';
import { DebitStatePipe } from '@pipes';

@Component({
  selector: 'app-debit-item',
  imports: [
    NgClass,
    MatListModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    DebitStatePipe,
    CurrencyPipe,
  ],
  templateUrl: './debit-item.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './debit-item.component.scss',
})
export class DebitItemComponent {
  @Input({ required: true }) debit!: DebitPartsFragment;
  @Input() menuTrigger!: MatMenuTrigger;

  @Output() update = new EventEmitter<DebitPartsFragment>();
  @Output() delete = new EventEmitter<DebitPartsFragment>();

  public openMenu(event: MouseEvent) {
    event.stopPropagation();
    if (this.menuTrigger) {
      this.menuTrigger.openMenu();
    }
  }
}
