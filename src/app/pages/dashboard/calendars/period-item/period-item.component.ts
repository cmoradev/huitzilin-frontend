import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgClass } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { PeriodPartsFragment } from '@graphql';
import { GlobalStateService } from '@services';

@Component({
  selector: 'app-period-item',
  imports: [
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    NgClass,
    DragDropModule,
  ],
  templateUrl: './period-item.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: `./period-item.component.scss`,
})
export class PeriodItemComponent {
  @Input({ required: true }) period!: PeriodPartsFragment;
  @Input() menuTrigger!: MatMenuTrigger;

  @Output() update = new EventEmitter<PeriodPartsFragment>();
  @Output() delete = new EventEmitter<PeriodPartsFragment>();

  private readonly _globalStateService = inject(GlobalStateService);

  public isActive = computed(() => {
    return this._globalStateService.period?.id === this.period.id;
  });

  public selectPeriod() {
    this._globalStateService.period = this.period;
  }

  public openMenu(event: MouseEvent) {
    event.stopPropagation();

    if (this.menuTrigger) {
      this.menuTrigger.openMenu();
    }
  }
}
