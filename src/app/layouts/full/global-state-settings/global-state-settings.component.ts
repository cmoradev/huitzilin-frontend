import { JsonPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { MatIconButton } from '@angular/material/button';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
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
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-global-state-settings',
  imports: [
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconButton,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './global-state-settings.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class GlobalStateSettingsComponent implements AfterViewInit, OnInit {
  @Output() closeSidenavLeft = new EventEmitter<void>();

  public readonly _globalStateService = inject(GlobalStateService);
  private readonly _updateOneUserGQL = inject(UpdateOneUserGQL);

  public branchTools = inject(BranchToolsService);
  public branchControl = new FormControl<string | null>(
    this._globalStateService.branch?.id ?? null
  );

  public cycleTools = inject(CycleToolsService);
  public cycleControl = new FormControl<string | null>(
    this._globalStateService.cycle?.id ?? null
  );

  ngOnInit(): void {
    this.branchTools.fetchAll();
    this.cycleTools.fetchAll();
  }

  ngAfterViewInit(): void {
    this.branchControl.valueChanges.pipe(debounceTime(300)).subscribe({
      next: (value) => {
        const branch = this.branchTools
          .options()
          .find((branch) => branch.id === value);

        if (!!branch) {
          this._globalStateService.branch = branch;
          this._updateUser({ branchId: branch.id });
        }
      },
    });

    this.cycleControl.valueChanges.pipe(debounceTime(300)).subscribe({
      next: (value) => {
        const cycle = this.cycleTools
          .options()
          .find((cycle) => cycle.id === value);

        if (!!cycle) {
          this._globalStateService.cycle = cycle;
          this._updateUser({ cycleId: cycle.id });
        }
      },
    });
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
