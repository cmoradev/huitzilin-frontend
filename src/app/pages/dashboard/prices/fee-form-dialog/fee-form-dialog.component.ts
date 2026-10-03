import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  CreateOneFeeGQL,
  FeePartsFragment,
  Frequency,
  UpdateOneFeeGQL,
} from '@graphql';
import { FormToolsService, GlobalStateService } from '@services';
import { frequencies } from '@utils/contains';
import { map } from 'rxjs';

@Component({
  selector: 'app-fee-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './fee-form-dialog.component.html',
  styles: ``,
})
export class FeeFormDialogComponent implements OnInit {
  public readonly formTools = inject(FormToolsService);
  private readonly _globalState = inject(GlobalStateService);

  public loading = signal(false);
  public data: FeePartsFragment | null = inject(MAT_DIALOG_DATA);

  public frequencies = frequencies;

  public formGroup = this.formTools.builder.group({
    name: this.formTools.builder.control<string>('',{
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(64)],
    }),
    amount: this.formTools.builder.control<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    frequency: this.formTools.builder.control<Frequency>(Frequency.Single, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    autoLoad: this.formTools.builder.control(false, {
      nonNullable: true,
    })
  });

  private readonly _globalStateService = inject(GlobalStateService);
  private readonly _createOneFee = inject(CreateOneFeeGQL);
  private readonly _updateOneFee = inject(UpdateOneFeeGQL);

  private readonly _dialogRef = inject(MatDialogRef<FeeFormDialogComponent>);

  ngOnInit(): void {
    if (!!this.data?.id) {
      this.formGroup.patchValue({
        name: this.data.name,
        amount: this.data.amount,
        frequency: this.data.frequency,
        autoLoad: this.data.autoLoad,
      });
    }

    this.formGroup.get('frequency')?.valueChanges.subscribe((value) => {
      if (!!value) {
        this.formGroup
          .get('name')
          ?.setValue(`${this.getFrequencyName(value as Frequency)}`);
      }
    });
  }

  public async submit(): Promise<void> {
    if (this.formGroup.valid) {
      this.loading.set(true);

      const values = this.formGroup.getRawValue();

      if (!!this.data?.id) {
        this._update(values).subscribe({
          next: (fee) => {
            this._dialogRef.close(fee);
          },
          error: (err) => {
            console.error('UPDATE FEE ERROR: ', err);
          },
          complete: () => {
            this.loading.set(false);
          },
        });
      } else if (this._globalStateService.activity!.id) {
        this._save(values).subscribe({
          next: (branch) => {
            this._dialogRef.close(branch);
          },
          error: (err) => {
            console.error('CREATE FEE ERROR: ', err);
          },
          complete: () => {
            this.loading.set(false);
          },
        });
      }
    }
  }

  private _update(values: FormValues) {
    return this._updateOneFee
      .mutate({
        variables: {
          id: this.data!.id,
          update: { ...values } as any,
        },
      })
      .pipe(map((value) => value.data?.updateOneFee));
  }

  private _save(values: FormValues) {
    return this._createOneFee
      .mutate({
        variables: {
          fee: {
            ...values,
            withTax: false,
            packageId: this._globalStateService.activity!.id,
          },
        },
      })
      .pipe(map((value) => value.data?.createOneFee));
  }

  private getFrequencyName(value: Frequency): string {
    switch (value) {
      case Frequency.Monthly:
        return 'Mensualidad';
      case Frequency.Single:
        return 'Pago único';
      case Frequency.Weekly:
        return 'Semanal';
      case Frequency.Daily:
        return 'Diario';
      case Frequency.Hourly:
        return 'Por hora';
      default:
        return value;
    }
  }
}

type FormValues = {
  name: string;
  amount: number;
  frequency: Frequency;
  autoLoad: boolean;
};
