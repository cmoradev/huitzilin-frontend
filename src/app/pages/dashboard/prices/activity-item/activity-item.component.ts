import { NgClass } from '@angular/common';
import { Component, computed, EventEmitter, inject, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { PackagePartsFragment } from '@graphql';
import { GlobalStateService } from '@services';

@Component({
  selector: 'app-activity-item',
  imports: [
    NgClass,
    MatIcon,
    MatIconButton,
    MatMenuModule,
    DragDropModule
  ],
  templateUrl: './activity-item.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: `./activity-item.component.scss`,
})
export class ActivityItemComponent {
  @Input({ required: true }) activity!: PackagePartsFragment;
  @Input() menuTrigger!: MatMenuTrigger;

  @Output() update = new EventEmitter<PackagePartsFragment>();
  @Output() delete = new EventEmitter<PackagePartsFragment>();

  private readonly _globalStateService = inject(GlobalStateService);

  public isActive = computed(() => {
    return this._globalStateService.activity?.id === this.activity.id;
  });

  public selectActivity() {
    this._globalStateService.activity = this.activity;
  }

  public openMenu(event: MouseEvent) {
    event.stopPropagation();
    if (this.menuTrigger) {
      this.menuTrigger.openMenu();
    }
  }
}
