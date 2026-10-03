import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { FeePartsFragment } from '@graphql';
import { FrequencyPipe } from '@pipes';

@Component({
  selector: 'app-fee-item',
  imports: [MatIcon, MatIconButton, MatMenuModule, FrequencyPipe, CurrencyPipe],
  templateUrl: './fee-item.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: `./fee-item.component.scss`,
})
export class FeeItemComponent {
  @Input({ required: true }) fee!: FeePartsFragment;
  @Input() menuTrigger!: MatMenuTrigger;

  @Output() update = new EventEmitter<FeePartsFragment>();
  @Output() delete = new EventEmitter<FeePartsFragment>();

  public openMenu(event: MouseEvent) {
    event.stopPropagation();

    if (this.menuTrigger) {
      this.menuTrigger.openMenu();
    }
  }
}
