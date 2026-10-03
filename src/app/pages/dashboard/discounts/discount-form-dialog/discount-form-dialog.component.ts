import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CreateDiscount,
  CreateOneDiscountGQL,
  DiscountBy,
  DiscountPartsFragment,
  UpdateDiscount,
  UpdateOneDiscountGQL,
} from '@graphql';
import { FormToolsService, GlobalStateService } from '@services';
import { discountTypes } from '@utils/contains';
import { map } from 'rxjs';

@Component({
  selector: 'app-discount-form-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './discount-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class DiscountFormDialogComponent {
  public readonly formTools = inject(FormToolsService);
  private readonly _snackBar = inject(MatSnackBar);

  public loading = signal(false);
  public data: DiscountPartsFragment | null = inject(MAT_DIALOG_DATA);

  private readonly _globalStateService = inject(GlobalStateService);
  private readonly _createOneCycle = inject(CreateOneDiscountGQL);
  private readonly _updateOneCycle = inject(UpdateOneDiscountGQL);

  private readonly _dialogRef = inject(
    MatDialogRef<DiscountFormDialogComponent>
  );

  public discountTypes = discountTypes;

  public formGroup = this.formTools.builder.group({
    name: this.formTools.builder.control<string>('', {
      validators: [Validators.required, Validators.maxLength(64)],
      nonNullable: true,
    }),
    value: this.formTools.builder.control<number>(0, {
      validators: [Validators.required, Validators.min(1), Validators.max(100)],
      nonNullable: true,
    }),
    type: this.formTools.builder.control<DiscountBy>(DiscountBy.Percentage, {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    if (!!this.data?.id) {
      this.formGroup.patchValue({
        name: this.data.name,
        value: this.data.value,
        type: this.data.type,
      });
    }

    this.formGroup.get('type')!.valueChanges.subscribe((type) => {
      this.formGroup.get('value')!.clearValidators();

      if (type === DiscountBy.Percentage) {
        this.formGroup
          .get('value')!
          .setValidators([
            Validators.required,
            Validators.min(1),
            Validators.max(100),
          ]);
      } else if (type === DiscountBy.Fixed) {
        this.formGroup
          .get('value')!
          .setValidators([Validators.required, Validators.min(1)]);
      }
      this.formGroup.get('value')!.updateValueAndValidity();
    });
  }

  public async submit(): Promise<void> {
    if (this.formGroup.valid) {
      this.loading.set(true);

      const values = this.formGroup.getRawValue();

      if (!!this.data?.id) {
        this._update(values).subscribe({
          next: (cycle) => {
            this._snackBar.open(
              'Se ha actualizado el descuento correctamente',
              'Cerrar',
              {
                duration: 1000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
              }
            );
            this._dialogRef.close(cycle);
          },
          error: (err) => {
            console.error('UPDATE DISCOUNT ERROR: ', err);
          },
          complete: () => {
            this.loading.set(false);
          },
        });
      } else if (this._globalStateService.branch?.id) {
        this._save(values).subscribe({
          next: (cycle) => {
            this._snackBar.open(
              'Se ha creado un descuento correctamente',
              'Cerrar',
              {
                duration: 1000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
              }
            );
            this._dialogRef.close(cycle);
          },
          error: (err) => {
            console.error('CREATE DISCOUNT ERROR: ', err);
          },
          complete: () => {
            this.loading.set(false);
          },
        });
      }
    }
  }

  private _update(values: UpdateDiscount) {
    return this._updateOneCycle
      .mutate({
        variables: {
          id: this.data!.id,
          update: values,
        },
      })
      .pipe(map((value) => value.data?.updateOneDiscount));
  }

  private _save(values: Omit<CreateDiscount, 'branchId'>) {
    return this._createOneCycle
      .mutate({
        variables: {
          discount: { ...values, branchId: this._globalStateService.branch!.id },
        },
      })
      .pipe(map((value) => value.data?.createOneDiscount));
  }
}
