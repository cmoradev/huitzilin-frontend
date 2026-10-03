import {
  ChangeDetectionStrategy,
  Component,
  effect,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  BranchPartsFragment,
  CyclePartsFragment,
  UpdateOneUserGQL,
  UpdateUser,
} from '@graphql';
import {
  BranchToolsService,
  CycleToolsService,
  GlobalStateService,
} from '@services';

@Component({
  selector: 'app-global-state-settings',
  imports: [
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconButton,
    MatIconModule,
  ],
  templateUrl: './global-state-settings.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class GlobalStateSettingsComponent implements OnInit {
  @Output() closeSidenavLeft = new EventEmitter<void>();

  public readonly _globalStateService = inject(GlobalStateService);
  private readonly _updateOneUserGQL = inject(UpdateOneUserGQL);

  public branchTools = inject(BranchToolsService);
  public readonly branchId = signal<string | null>(
    this._globalStateService.branch?.id ?? null
  );

  public cycleTools = inject(CycleToolsService);
  public readonly cycleId = signal<string | null>(
    this._globalStateService.cycle?.id ?? null
  );

  constructor() {
    effect(() => {
      const id = this.branchId();
      const options = this.branchTools.options();
      const branch = options.find((b) => b.id === id);

      if (!!branch && branch.id !== this._globalStateService.branch?.id) {
        this._globalStateService.branch = branch;
        this._updateUser({ branchId: branch.id });
      }
    });

    effect(() => {
      const id = this.cycleId();
      const options = this.cycleTools.options();
      const cycle = options.find((c) => c.id === id);

      if (!!cycle && cycle.id !== this._globalStateService.cycle?.id) {
        this._globalStateService.cycle = cycle;
        this._updateUser({ cycleId: cycle.id });
      }
    });
  }

  ngOnInit(): void {
    this.branchTools.fetchAll();
    this.cycleTools.fetchAll();
  }

  public displayFn(value: BranchPartsFragment | CyclePartsFragment): string {
    return value?.name ?? '';
  }

  private _updateUser(update: UpdateUser): void {
    if (this._globalStateService.session!.id) {
      this._updateOneUserGQL
        .mutate({
          variables: {
            id: this._globalStateService.session!.id,
            update,
          },
        })
        .subscribe({});
    }
  }
}