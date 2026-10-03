import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CreateManyDebitsGQL,
  DebitPartsFragment,
  DebitState,
  DiscountPartsFragment,
  Frequency,
  NestedId,
  UpdateOneDebitGQL,
} from '@graphql';
import { GlobalStateService } from '@services';
import { debitStates, DELINQUENCY_VALUE, frequencies } from '@utils/contains';
import { firstValueFrom, map } from 'rxjs';
import {
  addMonths,
  endOfMonth,
  format,
  isBefore,
  setDate,
  startOfMonth,
} from 'date-fns';
import {
  calculateAmountFromUnitPriceAndQuantity,
  calculateSubtotalAndDiscount,
  calculateTaxesFromSubtotal,
  TaxEnum,
} from '@calculations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SelectDebitDiscountFormDialogComponent } from '../select-debit-discount-form-dialog/select-debit-discount-form-dialog.component';
import { MatChipsModule } from '@angular/material/chips';
import { CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  applyEach,
  applyWhen,
  debounce,
  disabled,
  form,
  FormField,
  FormRoot,
  max,
  min,
  required,
} from '@angular/forms/signals';
import { DebitFormFields, DebitDiscountFormFields } from '@app/types/debits';

const defaultDueDate = `${format(
  addMonths(new Date(), 1),
  'yyyy-MM'
)}-05T12:00:00`;

@Component({
  selector: 'app-debit-form-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatChipsModule,
    CurrencyPipe,
    MatIconModule,
    FormField,
    FormRoot,
  ],
  templateUrl: './debit-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class DebitFormDialogComponent implements OnInit {
  private readonly _snackBar = inject(MatSnackBar);

  public loading = signal(false);
  public data: DebitPartsFragment | null = inject(MAT_DIALOG_DATA);

  public frequencies = frequencies;

  private readonly _globalStateService = inject(GlobalStateService);
  private readonly _createManyDebits = inject(CreateManyDebitsGQL);
  private readonly _updateOneDebit = inject(UpdateOneDebitGQL);
  private readonly _dialog = inject(MatDialog);
  private readonly _dialogRef = inject(MatDialogRef<DebitFormDialogComponent>);

  public readonly subtotal = signal(0);
  public readonly taxes = signal(0);
  public readonly total = signal(0);

  public readonly states = debitStates.filter(
    (state) =>
      state.value !== DebitState.Paid &&
      state.value !== DebitState.PartiallyPaid
  );

  public readonly isEditing = computed(() => !!this.data?.id);

  private readonly _initialModel = computed<DebitFormFields>(() => ({
    description: this.data?.description ?? '',
    unitPrice: this.data?.unitPrice ?? 0,
    quantity: this.data?.quantity ?? 1,
    amount: this.data?.amount ?? 0,
    delinquency: this.data?.delinquency ?? DELINQUENCY_VALUE,
    withTax: this.data?.withTax ?? true,
    state: this.data?.state ?? DebitState.Debt,
    dueDate: this.data?.dueDate ?? defaultDueDate,
    frequency: this.data?.frequency ?? Frequency.Single,
    discount: this.data?.discount ?? 0,
    discounts:
      this.data?.discounts.map<DebitDiscountFormFields>((discount) => ({
        id: discount.id,
        name: discount.name,
        type: discount.type,
        value: discount.value,
      })) ?? [],
  }));

  public readonly debitModel = linkedSignal<DebitFormFields, DebitFormFields>({
    source: this._initialModel,
    computation: (initial) => ({ ...initial }),
  });

  public readonly debitForm = form(this.debitModel, (schema) => {
    required(schema.description, { message: 'Campo requerido' });
    required(schema.unitPrice, { message: 'Campo requerido' });
    min(schema.unitPrice, 1, { message: 'El valor mínimo es 1' });
    required(schema.quantity, { message: 'Campo requerido' });
    min(schema.quantity, 1, { message: 'El valor mínimo es 1' });
    required(schema.delinquency, { message: 'Campo requerido' });
    min(schema.delinquency, 0, { message: 'El valor mínimo es 0' });
    required(schema.state, { message: 'Seleccione un estado' });
    required(schema.dueDate, { message: 'Seleccione fecha de vencimiento' });
    required(schema.frequency, { message: 'Seleccione una frecuencia' });
    required(schema.discounts, {
      message: 'Seleccione al menos un descuento',
    });

    // El importe y el descuento neto se calculan; permanecen readonly.
    disabled(schema.amount);
    disabled(schema.discount);

    // Aplica validación por cada descuento en el array.
    applyEach(schema.discounts, (item) => {
      required(item.id);
      required(item.name);
      required(item.type);
      required(item.value);
      min(item.value, 1);
    });

    // Sólo permitir editar `discount` cuando hay descuentos aplicados.
    applyWhen(
      schema,
      ({ valueOf }) => valueOf(schema.discounts).length === 0,
      (schema) => {
        max(schema.discount, 0);
      }
    );

    debounce(schema.unitPrice, 200);
    debounce(schema.quantity, 200);
  });

  public readonly discounts = computed(() => this.debitModel().discounts);

  public readonly amount = computed(() => {
    const unitPrice = this.debitModel().unitPrice;
    const quantity = this.debitModel().quantity;
    if (unitPrice && quantity) {
      return calculateAmountFromUnitPriceAndQuantity(unitPrice, quantity);
    }
    return 0;
  });

  constructor() {
    // Mantiene sincronizado el `amount` del modelo con el cálculo derivado.
    effect(() => {
      const calculated = this.amount();
      if (calculated !== this.debitModel().amount) {
        this.debitModel.update((m) => ({ ...m, amount: calculated }));
        this.debitForm.amount().value.set(calculated);
      }
    });

    // Sincroniza subtotal/descuento a partir de los descuentos aplicados.
    effect(() => {
      const discounts = this.debitModel().discounts;
      const amount = this.amount();
      if (amount !== undefined) {
        const { discount, subtotal } = calculateSubtotalAndDiscount(
          amount,
          discounts
        );

        this.debitForm.discount().value.set(discount);
        this.subtotal.set(subtotal);
      }
    });

    // Calcula impuestos y total cuando cambian subtotal o withTax.
    effect(() => {
      const withTax = this.debitModel().withTax;
      const { taxes, total } = calculateTaxesFromSubtotal(
        this.subtotal(),
        withTax ? TaxEnum.Sixteen : TaxEnum.Zero
      );

      this.taxes.set(taxes);
      this.total.set(total);
    });

    effect(() => {
      this._dialogRef.disableClose = this.loading();
    });
  }

  ngOnInit(): void {
    // No initialization required: los efectos reaccionan a los signals.
  }

  public addDiscount(discount: DiscountPartsFragment): void {
    this.debitModel.update((m) => ({
      ...m,
      discounts: [
        ...m.discounts,
        {
          id: discount.id,
          name: discount.name,
          type: discount.type,
          value: discount.value,
        },
      ],
    }));
  }

  public removeDiscount(index: number): void {
    this.debitModel.update((m) => ({
      ...m,
      discounts: m.discounts.filter((_, idx) => idx !== index),
    }));
  }

  public selectDebitDiscount(): void {
    const dialog$ = this._dialog.open(SelectDebitDiscountFormDialogComponent, {
      width: '32rem',
      disableClose: true,
    });

    dialog$.afterClosed().subscribe({
      next: (discount: DiscountPartsFragment | undefined) => {
        if (discount) {
          this.addDiscount(discount);
        }
      },
    });
  }

  public async submit(): Promise<void> {
    if (this.debitForm().invalid()) {
      return;
    }

    const values = this.debitModel();
    this.loading.set(true);

    try {
      if (this.isEditing()) {
        const updated = await firstValueFrom(
          this._updateOneDebit.mutate({
            variables: {
              id: this.data!.id,
              update: this._buildPayload(values),
            },
          })
        );

        this._snackBar.open(
          'Se ha actualizado un adeudo correctamente',
          'Cerrar',
          {
            duration: 1000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          }
        );
        this._dialogRef.close(updated.data?.updateOneDebit);
      } else if (
        !!this._globalStateService.enrollment?.id &&
        !!this._globalStateService.student?.id &&
        !!this._globalStateService.branch?.id
      ) {
        const debits = this.generateDebits(this._buildPayload(values));
        const created = await firstValueFrom(
          this._createManyDebits.mutate({
            variables: {
              debits: debits.map((debit) => ({
                ...debit,
                paymentDate: null,
                studentId: this._globalStateService.student!.id,
                branchId: this._globalStateService.branch!.id,
                enrollmentId: this._globalStateService.enrollment!.id,
              })),
            },
          })
        );

        this._dialogRef.close(created.data?.createManyDebits);
      }
    } catch (err) {
      console.error('UPDATE/CREATE DEBIT ERROR: ', err);
    } finally {
      this.loading.set(false);
    }
  }

  private _buildPayload(values: DebitFormFields) {
    return {
      description: values.description,
      unitPrice: values.unitPrice,
      discount: values.discount,
      // El API recibe la fecha con hora (como en la versión original).
      // El datepicker devuelve 'YYYY-MM-DD' al editar; se normaliza a
      // mediodía local para evitar corrimientos de día por zona horaria.
      dueDate: values.dueDate.includes('T')
        ? values.dueDate
        : `${values.dueDate}T12:00:00`,
      quantity: values.quantity,
      state: values.state,
      withTax: values.withTax,
      frequency: values.frequency,
      delinquency: values.delinquency,
      discounts: values.discounts.map<NestedId>(
        (value) => ({ id: value.id })
      ),
    };
  }

  private generateDebits(value: ReturnType<typeof this._buildPayload>) {
    const debits: Array<typeof value> = [];

    switch (value.frequency) {
      case Frequency.Monthly:
        if (
          !!this._globalStateService.enrollment?.start &&
          !!this._globalStateService.enrollment?.end
        ) {
          const startPeriod = startOfMonth(
            `${this._globalStateService.enrollment!.start}T12:00:00`
          );
          const endPeriod = endOfMonth(
            `${this._globalStateService.enrollment!.end}T12:00:00`
          );

          let currentDate = startPeriod;

          while (isBefore(currentDate, endPeriod)) {
            currentDate = setDate(currentDate, 5);

            const description = `${value.description} - ${format(
              currentDate,
              'MMMM'
            )}`;

            debits.push({
              ...value,
              description,
              frequency: Frequency.Single,
              dueDate: format(currentDate, 'yyyy-MM-dd') + 'T12:00:00',
            });

            currentDate = addMonths(currentDate, 1);
          }
        }

        break;

      default:
        debits.push(value);
        break;
    }

    return debits;
  }
}
