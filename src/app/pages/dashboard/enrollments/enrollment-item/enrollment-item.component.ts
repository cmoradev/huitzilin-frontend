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
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EnrollmentPartsFragment } from '@graphql';
import { EnrollmentStatePipe } from '@pipes';
import { GlobalStateService } from '@services';

@Component({
  selector: 'app-enrollment-item',
  imports: [
    MatIconModule,
    MatIconButton,
    MatMenuModule,
    MatProgressBarModule,
    MatTooltipModule,
    DragDropModule,
    NgClass
  ],
  templateUrl: './enrollment-item.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './enrollment-item.component.scss',
})
export class EnrollmentItemComponent {
  @Input({ required: true }) node!: EnrollmentPartsFragment;
  @Input() menuTrigger!: MatMenuTrigger;

  @Output() update = new EventEmitter<EnrollmentPartsFragment>();
  @Output() remove = new EventEmitter<EnrollmentPartsFragment>();

  private readonly _globalStateService = inject(GlobalStateService);

  public isActive = computed(() => {
    return this._globalStateService.enrollment?.id === this.node.id;
  });

  public selectEnrollment() {
    this._globalStateService.enrollment = this.node;
  }

  public openMenu(event: MouseEvent) {
    event.stopPropagation();
    if (this.menuTrigger) {
      this.menuTrigger.openMenu();
    }
  }
}
