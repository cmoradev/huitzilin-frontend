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
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  CreateOneFeeGQL,
  FeePartsFragment,
  Frequency,
  UpdateOneFeeGQL,
} from '@graphql';
import { GlobalStateService } from '@services';
import { frequencies } from '@utils/contains';
import {
  form,
  FormField,
  FormRoot,
  maxLength,
  min,
  required,
} from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { FeeFormFields } from '@app/types/payments';

function getFrequencyName(value: Frequency): string {
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

@Component({
  selector: 'app-fee-form-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormField,
    FormRoot,
  ],
  templateUrl: './fee-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class FeeFormDialogComponent {
  public readonly data: FeePartsFragment | null = inject(MAT_DIALOG_DATA);

  private readonly _globalStateService = inject(GlobalStateService);
  private readonly _createOneFee = inject(CreateOneFeeGQL);
  private readonly _updateOneFee = inject(UpdateOneFeeGQL);

  private readonly _dialogRef = inject(MatDialogRef<FeeFormDialogComponent>);

  public readonly frequencies = frequencies;

  public readonly isEditing = computed(() => !!this.data?.id);

  private readonly _initialModel = computed<FeeFormFields>(() => ({
    name: this.data?.name ?? '',
    amount: this.data?.amount ?? 0,
    frequency: this.data?.frequency ?? Frequency.Single,
    autoLoad: this.data?.autoLoad ?? false,
  }));

  public readonly feeModel = linkedSignal<FeeFormFields, FeeFormFields>({
    source: this._initialModel,
    computation: (initial) => ({ ...initial }),
  });

  /**
   * Marca cuando el usuario editó explícitamente el nombre para detener
   * el sincronizado automático con la frecuencia.
   */
  private readonly _nameEdited = signal(false);

  public readonly feeForm = form(this.feeModel, (schema) => {
    required(schema.name, { message: 'Campo requerido' });
    maxLength(schema.name, 64, { message: 'Máximo 64 caracteres' });
    required(schema.amount, { message: 'Campo requerido' });
    min(schema.amount, 0, { message: 'El valor debe ser mayor o igual a 0' });
    required(schema.frequency, { message: 'Campo requerido' });
  });

  public readonly submitting = signal(false);

  constructor() {
    effect(() => {
      const frequency = this.feeModel().frequency;

      if (!this._nameEdited() && !!frequency) {
        this.feeModel.update((m) => ({
          ...m,
          name: getFrequencyName(frequency),
        }));
      }
    });

    effect(() => {
      this._dialogRef.disableClose = this.submitting();
    });
  }

  public onNameInput(value: string): void {
    this._nameEdited.set(true);
    this.feeForm.name().value.set(value);
  }

  public async submit(): Promise<void> {
    if (this.feeForm().invalid()) {
      return;
    }

    const values = this.feeModel();
    this.submitting.set(true);

    try {
      if (this.isEditing()) {
        const updated = await firstValueFrom(
          this._updateOneFee.mutate({
            variables: {
              id: this.data!.id,
              update: { ...values } as any,
            },
          })
        );

        this._dialogRef.close(updated.data?.updateOneFee);
      } else if (this._globalStateService.activity?.id) {
        const created = await firstValueFrom(
          this._createOneFee.mutate({
            variables: {
              fee: {
                ...values,
                withTax: false,
                packageId: this._globalStateService.activity!.id,
              },
            },
          })
        );

        this._dialogRef.close(created.data?.createOneFee);
      }
    } catch (err) {
      console.error(
        this.isEditing() ? 'UPDATE FEE ERROR: ' : 'CREATE FEE ERROR: ',
        err
      );
    } finally {
      this.submitting.set(false);
    }
  }
}