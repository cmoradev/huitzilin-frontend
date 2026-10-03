import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
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
import { GlobalStateService } from '@services';
import { discountTypes } from '@utils/contains';
import {
  applyWhen,
  form,
  FormField,
  FormRoot,
  max,
  maxLength,
  min,
  required,
} from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { DiscountFormFields } from '@app/types/discounts';

@Component({
  selector: 'app-discount-form-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    FormField,
    FormRoot,
  ],
  templateUrl: './discount-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class DiscountFormDialogComponent {
  public readonly data: DiscountPartsFragment | null = inject(MAT_DIALOG_DATA);

  private readonly _snackBar = inject(MatSnackBar);

  private readonly _globalStateService = inject(GlobalStateService);
  private readonly _createOneDiscount = inject(CreateOneDiscountGQL);
  private readonly _updateOneDiscount = inject(UpdateOneDiscountGQL);

  private readonly _dialogRef = inject(
    MatDialogRef<DiscountFormDialogComponent>
  );

  public readonly discountTypes = discountTypes;

  public readonly isEditing = computed(() => !!this.data?.id);

  private readonly _initialModel = computed<DiscountFormFields>(() => ({
    name: this.data?.name ?? '',
    value: this.data?.value ?? 0,
    type: this.data?.type ?? DiscountBy.Percentage,
  }));

  public readonly discountModel = linkedSignal<DiscountFormFields, DiscountFormFields>({
    source: this._initialModel,
    computation: (initial) => ({ ...initial }),
  });

  public readonly discountForm = form(this.discountModel, (schema) => {
    required(schema.name, { message: 'Campo requerido' });
    maxLength(schema.name, 64, { message: 'Máximo 64 caracteres' });
    required(schema.type, { message: 'Campo requerido' });

    // Porcentaje: 1-100; Monto fijo: >= 1.
    applyWhen(
      schema,
      ({ valueOf }) => valueOf(schema.type) === DiscountBy.Percentage,
      (schema) => {
        required(schema.value, { message: 'Campo requerido' });
        min(schema.value, 1, { message: 'El valor mínimo es 1' });
        max(schema.value, 100, { message: 'El valor máximo es 100' });
      }
    );

    applyWhen(
      schema,
      ({ valueOf }) => valueOf(schema.type) === DiscountBy.Fixed,
      (schema) => {
        required(schema.value, { message: 'Campo requerido' });
        min(schema.value, 1, { message: 'El valor mínimo es 1' });
      }
    );
  });

  public readonly submitting = signal(false);

  constructor() {
    effect(() => {
      this._dialogRef.disableClose = this.submitting();
    });
  }

  public async submit(): Promise<void> {
    if (this.discountForm().invalid()) {
      return;
    }

    const values = this.discountModel();
    this.submitting.set(true);

    try {
      if (this.isEditing()) {
        const updated = await firstValueFrom(
          this._updateOneDiscount.mutate({
            variables: {
              id: this.data!.id,
              update: values as UpdateDiscount,
            },
          })
        );

        this._dialogRef.close(updated.data?.updateOneDiscount);
        this._snackBar.open(
          'Se ha actualizado el descuento correctamente',
          'Cerrar',
          {
            duration: 1000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          }
        );
      } else if (this._globalStateService.branch?.id) {
        const created = await firstValueFrom(
          this._createOneDiscount.mutate({
            variables: {
              discount: {
                ...values,
                branchId: this._globalStateService.branch!.id,
              } as Omit<CreateDiscount, 'branchId'> & {
                branchId: string;
              },
            },
          })
        );

        this._dialogRef.close(created.data?.createOneDiscount);
        this._snackBar.open(
          'Se ha creado un descuento correctamente',
          'Cerrar',
          {
            duration: 1000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          }
        );
      }
    } catch (err) {
      console.error(
        this.isEditing()
          ? 'UPDATE DISCOUNT ERROR: '
          : 'CREATE DISCOUNT ERROR: ',
        err
      );
    } finally {
      this.submitting.set(false);
    }
  }
}