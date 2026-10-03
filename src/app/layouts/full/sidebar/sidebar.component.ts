import { Component, computed, EventEmitter, inject, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GlobalStateService } from '@services';

@Component({
  selector: 'app-sidebar',
  imports: [MatToolbarModule, MatRippleModule],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class SidebarComponent {
  @Output() toggleSidenavRight = new EventEmitter<void>();

  private readonly _globalStateService = inject(GlobalStateService);

  public currentBranch = computed(() => this._globalStateService.branch);
}
