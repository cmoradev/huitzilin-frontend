import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  CreateOneCycleGQL,
  CyclePartsFragment,
  UpdateOneCycleGQL,
} from '@graphql';
import { FormToolsService, GlobalStateService } from '@services';
import { map } from 'rxjs';

@Component({
  selector: 'app-cycle-form-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './cycle-form-dialog.component.html',
  styles: ``,
})
export class CycleFormDialogComponent {
  public readonly formTools = inject(FormToolsService);

  public loading = signal(false);
  public data: CyclePartsFragment | null = inject(MAT_DIALOG_DATA);

  private readonly _createOneCycle = inject(CreateOneCycleGQL);
  private readonly _updateOneCycle = inject(UpdateOneCycleGQL);

  private readonly _dialogRef = inject(MatDialogRef<CycleFormDialogComponent>);

  public formGroup = this.formTools.builder.group(
    {
      name: ['', [Validators.required, Validators.maxLength(16)]],
      start: ['', [Validators.required]],
      end: ['', [Validators.required]],
    },
    {
      validators: [this.formTools.isEndDateAfterStartDate],
    }
  );

  ngOnInit(): void {
    if (!!this.data?.id) {
      this.formGroup.patchValue({
        name: this.data.name,
        start: `${this.data.start}T12:00:00`,
        end: `${this.data.end}T12:00:00`,
      });
    }
  }

  public async submit(): Promise<void> {
    if (this.formGroup.valid) {
      this.loading.set(true);

      const values = this.formGroup.getRawValue() as any;

      if (!!this.data?.id) {
        this._update(values).subscribe({
          next: (cycle) => {
            this._dialogRef.close(cycle);
          },
          error: (err) => {
            console.error('UPDATE CYCLE ERROR: ', err);
          },
          complete: () => {
            this.loading.set(false);
          },
        });
      } else {
        this._save(values).subscribe({
          next: (cycle) => {
            this._dialogRef.close(cycle);
          },
          error: (err) => {
            console.error('CREATE CYCLE ERROR: ', err);
          },
          complete: () => {
            this.loading.set(false);
          },
        });
      }
    }
  }

  private _update(values: FormValues) {
    return this._updateOneCycle
      .mutate({
        variables: {
          id: this.data!.id,
          update: {
            ...values,
            start: new Date(values.start).toISOString(),
            end: new Date(values.end).toISOString(),
          },
        },
      })
      .pipe(map((value) => value.data?.updateOneCycle));
  }

  private _save(values: FormValues) {
    return this._createOneCycle
      .mutate({
        variables: {
          cycle: {
            ...values,
            start: new Date(values.start).toISOString(),
            end: new Date(values.end).toISOString(),
          },
        },
      })
      .pipe(map((value) => value.data?.createOneCycle));
  }
}

type FormValues = {
  name: string;
  start: string;
  end: string;
};
