import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  CreateOneLevelGQL,
  LevelPartsFragment,
  UpdateOneLevelGQL,
} from '@graphql';
import { FormToolsService, GlobalStateService } from '@services';
import { map } from 'rxjs';

@Component({
  selector: 'app-level-form-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './level-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class LevelFormDialogComponent {
  public readonly formTools = inject(FormToolsService);

  public loading = signal(false);
  public data: LevelPartsFragment | null = inject(MAT_DIALOG_DATA);

  private readonly _globalStateService = inject(GlobalStateService);
  private readonly _createOneLevel = inject(CreateOneLevelGQL);
  private readonly _updateOneLevel = inject(UpdateOneLevelGQL);

  private readonly _dialogRef = inject(MatDialogRef<LevelFormDialogComponent>);

  public formGroup = this.formTools.builder.group({
    name: ['', [Validators.required, Validators.maxLength(32)]],
    abbreviation: ['', [Validators.required, Validators.maxLength(8)]],
  });

  ngOnInit(): void {
    if (!!this.data?.id) {
      this.formGroup.patchValue({
        name: this.data.name,
        abbreviation: this.data.abbreviation,
      });
    }
  }

  public async submit(): Promise<void> {
    if (this.formGroup.valid) {
      this.loading.set(true);

      const values = this.formGroup.getRawValue() as any;

      if (!!this.data?.id) {
        this._update(values).subscribe({
          next: (level) => {
            this._dialogRef.close(level);
          },
          error: (err) => {
            console.error('UPDATE LEVEL ERROR: ', err);
          },
          complete: () => {
            this.loading.set(false);
          },
        });
      } else if (this._globalStateService.branch?.id) {
        this._save(values).subscribe({
          next: (cycle) => {
            this._dialogRef.close(cycle);
          },
          error: (err) => {
            console.error('CREATE LEVEL ERROR: ', err);
          },
          complete: () => {
            this.loading.set(false);
          },
        });
      }
    }
  }

  private _update(values: FormValues) {
    return this._updateOneLevel
      .mutate({
        variables: {
          id: this.data!.id,
          update: {
            ...values,
          },
        },
      })
      .pipe(map((value) => value.data?.updateOneLevel));
  }

  private _save(values: FormValues) {
    return this._createOneLevel
      .mutate({
        variables: {
          level: {
            ...values,
            order: 0,
            branchId: this._globalStateService.branch!.id,
          },
        },
      })
      .pipe(map((value) => value.data?.createOneLevel));
  }
}

type FormValues = {
  name: string;
  abbreviation: string;
};
