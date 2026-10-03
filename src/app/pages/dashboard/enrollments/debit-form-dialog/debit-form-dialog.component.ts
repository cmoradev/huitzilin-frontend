import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  FormArray,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
  CreateDebit,
  CreateManyDebitsGQL,
  DebitPartsFragment,
  DebitState,
  DiscountBy,
  DiscountPartsFragment,
  Frequency,
  NestedId,
  UpdateDebit,
  UpdateOneDebitGQL,
} from '@graphql';
import { FormToolsService, GlobalStateService } from '@services';
import { debitStates, DELINQUENCY_VALUE, frequencies } from '@utils/contains';
import { map, merge, startWith } from 'rxjs';
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
import { toObservable } from '@angular/core/rxjs-interop';
import { id } from 'date-fns/locale';

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
    ReactiveFormsModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatChipsModule,
    CurrencyPipe,
    MatIconModule,
  ],
  templateUrl: './debit-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class DebitFormDialogComponent {
  public readonly formTools = inject(FormToolsService);
  private readonly _snackBar = inject(MatSnackBar);

  public loading = signal(false);
  public data: DebitPartsFragment | null = inject(MAT_DIALOG_DATA);

  public frequencies = frequencies;

  private readonly _globalStateService = inject(GlobalStateService);
  private readonly _createManyDebits = inject(CreateManyDebitsGQL);
  private readonly _updateOneDebit = inject(UpdateOneDebitGQL);
  private readonly _dialog = inject(MatDialog);
  private readonly _dialogRef = inject(MatDialogRef<DebitFormDialogComponent>);

  public subtotal = signal(0);
  public subtotal$ = toObservable(this.subtotal);

  public amount = signal(0);
  public taxes = signal(0);
  public total = signal(0);

  public states = debitStates.filter(
    (state) =>
      state.value !== DebitState.Paid &&
      state.value !== DebitState.PartiallyPaid
  );

  public formGroup = this.formTools.builder.group({
    description: this.formTools.builder.control<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    unitPrice: this.formTools.builder.control<number>(0, {
      validators: [Validators.required, Validators.min(1)],
      nonNullable: true,
    }),
    quantity: this.formTools.builder.control<number>(1, {
      validators: [Validators.required, Validators.min(1)],
      nonNullable: true,
    }),
    amount: this.formTools.builder.control<number>(0, {
      validators: [Validators.required, Validators.min(1)],
      nonNullable: true,
    }),
    delinquency: this.formTools.builder.control<number>(DELINQUENCY_VALUE, {
      validators: [Validators.required, Validators.min(0)],
      nonNullable: true,
    }),
    withTax: this.formTools.builder.control<boolean>(true, {
      nonNullable: true,
    }),
    state: this.formTools.builder.control<DebitState>(DebitState.Debt, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    dueDate: this.formTools.builder.control<string>(defaultDueDate, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    frequency: this.formTools.builder.control<Frequency>(Frequency.Single, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    discount: this.formTools.builder.control<number>(0, {
      validators: [Validators.required, Validators.min(1)],
      nonNullable: true,
    }),
    discounts: this.formTools.builder.array<FormGroup>([]),
  });

  ngOnInit(): void {
    this.formGroup.get('amount')?.disable();
    this.formGroup.get('discount')?.disable();

    merge(
      this.formGroup.get('unitPrice')!.valueChanges,
      this.formGroup.get('quantity')!.valueChanges
    ).subscribe({
      next: () => {
        const unitPrice = this.formGroup.get('unitPrice')?.value;
        const quantity = this.formGroup.get('quantity')?.value;

        if (unitPrice !== undefined && quantity !== undefined) {
          const amount = calculateAmountFromUnitPriceAndQuantity(
            unitPrice,
            quantity
          );

          this.formGroup.get('amount')!.setValue(amount);
        }
      },
    });

    merge(
      this.formGroup.get('discounts')!.valueChanges,
      this.formGroup.get('amount')!.valueChanges
    )
      .pipe(startWith(0))
      .subscribe({
        next: () => {
          const discounts = this.formGroup.get('discounts')?.value;
          const amount = this.formGroup.get('amount')?.value;

          if (amount !== undefined && discounts !== undefined) {
            const { discount, subtotal } = calculateSubtotalAndDiscount(
              amount,
              discounts as DiscountPartsFragment[]
            );

            this.formGroup.get('discount')?.setValue(discount);

            this.amount.set(amount);
            this.subtotal.set(subtotal);
          }
        },
      });

    merge(this.formGroup.get('withTax')!.valueChanges, this.subtotal$)
      .pipe(startWith(0))
      .subscribe({
        next: () => {
          const withTax = this.formGroup.get('withTax')?.value ?? false;

          const { taxes, total } = calculateTaxesFromSubtotal(
            this.subtotal(),
            withTax ? TaxEnum.Sixteen : TaxEnum.Zero
          );

          this.taxes.set(taxes);
          this.total.set(total);
        },
      });

    if (!!this.data?.id) {
      this.formGroup.patchValue({
        description: this.data.description,
        unitPrice: this.data.unitPrice,
        quantity: this.data.quantity,
        amount: this.data.amount,
        withTax: this.data.withTax,
        state: this.data.state,
        discount: this.data.discount,
        dueDate: `${this.data.dueDate}T12:00:00`,
      });

      this.data.discounts.forEach((discount) => {
        this.addDebitDiscount(discount);
      });
    }
  }

  public async submit(): Promise<void> {
    if (this.formGroup.valid) {
      const values = this.formGroup.getRawValue();

      const { amount: _, ...payload } = values;

      if (!!this.data?.id) {
        this.loading.set(true);

        this._update({
          ...payload,
          discounts: payload.discounts.map(
            (value: any) => ({ id: value.id } as NestedId)
          ),
        }).subscribe({
          next: (debit) => {
            this._snackBar.open(
              'Se ha actualizado un adeudo correctamente',
              'Cerrar',
              {
                duration: 1000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
              }
            );
            this._dialogRef.close(debit);
          },
          error: (err) => {
            console.error('UPDATE DEBIT ERROR: ', err);
          },
          complete: () => {
            this.loading.set(false);
          },
        });
      } else if (
        !!this._globalStateService?.enrollment?.id &&
        !!this._globalStateService?.student?.id &&
        !!this._globalStateService?.branch?.id
      ) {
        this.loading.set(true);

        const debit = {
          ...payload,
          discounts: payload.discounts.map(
            (value: any) => ({ id: value.id } as NestedId)
          ),
        };

        const debits = this.generateDebits(debit);

        this._createManyDebits
          .mutate({
            variables: {
              debits: debits.map((debit: any) => ({
                description: debit.description,
                unitPrice: debit.unitPrice,
                discount: debit.discount,
                dueDate: debit.dueDate,
                quantity: debit.quantity,
                state: debit.state,
                withTax: debit.withTax,
                frequency: debit.frequency,
                delinquency: debit.delinquency,
                paymentDate: null,
                studentId: this._globalStateService.student!.id,
                branchId: this._globalStateService.branch!.id,
                discounts: debit.discounts.map((discount: any) => ({
                  id: discount.id,
                })),
                enrollmentId: this._globalStateService.enrollment!.id,
              })),
            },
          })
          .pipe(map((resp) => resp.data?.createManyDebits))
          .subscribe({
            next: (resp) => {
              this.loading.set(false);
              this._dialogRef.close(resp);
            },
          });
      }
    }
  }

  private _update(values: UpdateDebit) {
    return this._updateOneDebit
      .mutate({
        variables: {
          id: this.data!.id,
          update: { ...values },
        },
      })
      .pipe(map((value) => value.data?.updateOneDebit));
  }

  public selectDebitDiscount() {
    const dialog$ = this._dialog.open(SelectDebitDiscountFormDialogComponent, {
      width: '32rem',
      disableClose: true,
    });

    dialog$.afterClosed().subscribe({
      next: (discount) => {
        if (discount) {
          this.addDebitDiscount(discount);
        }
      },
    });
  }

  public get discounts(): FormArray<FormGroup> {
    return this.formGroup.get('discounts') as FormArray<FormGroup>;
  }

  public removeDiscount(index: number): void {
    this.discounts.removeAt(index);
  }

  private addDebitDiscount(initialValues: DiscountPartsFragment): void {
    const { name, type, value, id } = initialValues;

    const debitDiscountFormGroup = this.formTools.builder.group({
      id: this.formTools.builder.control<string>(id, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      name: this.formTools.builder.control<string>(name, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      type: this.formTools.builder.control<DiscountBy>(type, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      value: this.formTools.builder.control<number>(value, {
        validators: [Validators.required, Validators.min(1)],
        nonNullable: true,
      }),
    });

    this.discounts.push(debitDiscountFormGroup);
  }

  private generateDebits(value: PayloadDebit) {
    const debits: Array<PayloadDebit> = [];

    switch (value.frequency) {
      case Frequency.Monthly:
        if (
          !!this._globalStateService!.enrollment?.start &&
          !!this._globalStateService!.enrollment?.end
        ) {
          const startPeriod = startOfMonth(
            `${this._globalStateService!.enrollment!.start}T12:00:00`
          );
          const endPeriod = endOfMonth(
            `${this._globalStateService!.enrollment!.end}T12:00:00`
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

type PayloadDebit = {
  discounts: NestedId[];
  description: string;
  unitPrice: number;
  quantity: number;
  withTax: boolean;
  state: DebitState;
  dueDate: string;
  frequency: Frequency;
  discount: number;
};
