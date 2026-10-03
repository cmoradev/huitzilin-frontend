import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  CreateDebit,
  CreateManyDebitsGQL,
  DebitState,
  Frequency,
} from '@graphql';
import { FormToolsService, GlobalStateService } from '@services';
import {
  addMonths,
  endOfMonth,
  format,
  isBefore,
  setDate,
  startOfMonth,
} from 'date-fns';
import Decimal from 'decimal.js';
import { debounceTime, filter, map, startWith } from 'rxjs';
import { DebitWithDiscountFormComponent } from '../debit-with-discount-form/debit-with-discount-form.component';
import {
  calculateBaseAndTaxFromTotal,
  calculateSubtotalAndDiscount,
} from '@calculations';
import { DELINQUENCY_VALUE } from '@utils/contains';

@Component({
  selector: 'app-light-on-prices',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatExpansionModule,
    DebitWithDiscountFormComponent,
  ],
  templateUrl: './light-on-prices.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class LightOnPricesComponent implements OnInit {
  private readonly _formTools = inject(FormToolsService);
  private readonly _globalState = inject(GlobalStateService);
  private readonly _createManyDebits = inject(CreateManyDebitsGQL);
  private readonly _dialogRef = inject(MatDialogRef<LightOnPricesComponent>);

  public hoursControl = new FormControl<number>(
    this._globalState.enrollment!.hours || 0
  );
  public loading = signal<boolean>(false);

  public formGroup = this._formTools.builder.group({
    debits: this._formTools.builder.array([]),
  });

  ngOnInit(): void {
    this.hoursControl.valueChanges
      .pipe(
        startWith(this._globalState.enrollment!.hours || 0),
        filter((value) => typeof value === 'number'),
        debounceTime(300)
      )
      .subscribe({
        next: (value) => {
          this.setPlan(value);
        },
      });
  }

  public get debits(): FormArray<FormGroup> {
    return this.formGroup.get('debits') as FormArray<FormGroup>;
  }

  public removeDebit(index: number): void {
    this.debits.removeAt(index);
  }

  public addDebit(
    initialValues: Omit<
      CreateDebit,
      | 'enrollmentId'
      | 'studentId'
      | 'branchId'
      | 'paymentDate'
      | 'discount'
      | 'delinquency'
    >
  ): void {
    const {
      description,
      unitPrice,
      quantity,
      dueDate,
      state,
      withTax,
      frequency,
    } = initialValues;

    const unitPriceDecimal = new Decimal(unitPrice);
    const quantityDecimal = new Decimal(quantity);

    const amount = Number(unitPriceDecimal.times(quantityDecimal).toFixed(6));

    const debitFormGroup = this._formTools.builder.group({
      description: this._formTools.builder.control<string>(description, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      unitPrice: this._formTools.builder.control<number>(unitPrice, {
        validators: [Validators.required, Validators.min(1)],
        nonNullable: true,
      }),
      quantity: this._formTools.builder.control<number>(quantity, {
        validators: [Validators.required, Validators.min(1)],
        nonNullable: true,
      }),
      amount: this._formTools.builder.control<number>(amount, {
        validators: [Validators.required, Validators.min(1)],
        nonNullable: true,
      }),
      discount: this._formTools.builder.control<number>(0, {
        validators: [Validators.required, Validators.min(1)],
        nonNullable: true,
      }),
      withTax: this._formTools.builder.control<boolean>(withTax, {
        nonNullable: true,
      }),
      state: this._formTools.builder.control<DebitState>(state, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      frequency: this._formTools.builder.control<Frequency>(frequency, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      dueDate: this._formTools.builder.control<string>(dueDate, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      discounts: this._formTools.builder.array<FormGroup>([]),
    });

    this.debits.push(debitFormGroup);
  }

  public setPlan(hours: number): void {
    if (
      !!this._globalState!.enrollment?.start &&
      !!this._globalState!.enrollment?.end
    ) {
      let packagePrice = 0;
      let remainingHours = hours;

      // Buscar el paquete más grande que no exceda las horas solicitadas
      const packageData = PRICE_LIST.slice()
        .reverse()
        .find((p) => p.hours <= hours);

      if (packageData) {
        packagePrice = packageData.price;
        remainingHours = hours - packageData.hours;
      }

      // Calcular el precio de las horas restantes
      const extraPrice = remainingHours * HOUR_PRICE;

      // Precio total
      const totalPrice = packagePrice + extraPrice;
      const { amount } = calculateBaseAndTaxFromTotal(totalPrice);

      const startPeriod = startOfMonth(
        `${this._globalState!.enrollment!.start}T12:00:00`
      );
      const endPeriod = endOfMonth(
        `${this._globalState!.enrollment!.end}T12:00:00`
      );

      let currentDate = startPeriod;

      this.debits.clear();

      while (isBefore(currentDate, endPeriod)) {
        currentDate = setDate(currentDate, 5);

        const description = `Mensualidad - ${format(currentDate, 'MMMM')}`;

        this.addDebit({
          quantity: 1,
          dueDate: format(currentDate, 'yyyy-MM-dd') + 'T12:00:00',
          description,
          withTax: true,
          unitPrice: amount,
          state: DebitState.Debt,
          frequency: Frequency.Single,
        });

        currentDate = addMonths(currentDate, 1);
      }
    }
  }

  public submit(): void {
    if (this.formGroup.valid) {
      const values = this.formGroup.getRawValue();

      this.loading.set(true);

      if (
        !!this._globalState.enrollment?.id &&
        !!this._globalState.student?.id &&
        !!this._globalState.branch?.id
      ) {
        this._createManyDebits
          .mutate({
            variables: {
              debits: values.debits.map((debit: any) => ({
                description: debit.description,
                unitPrice: debit.unitPrice,
                discount: debit.discount,
                dueDate: debit.dueDate,
                quantity: debit.quantity,
                state: debit.state,
                withTax: debit.withTax,
                frequency: debit.frequency,
                paymentDate: null,
                studentId: this._globalState.student!.id,
                branchId: this._globalState.branch!.id,
                delinquency: DELINQUENCY_VALUE,
                discounts: debit.discounts.map((discount: any) => ({
                  id: discount.id,
                })),
                enrollmentId: this._globalState.enrollment!.id,
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
}

const HOUR_PRICE = 85;

const PRICE_LIST = [
  { hours: 4, price: 600 },
  { hours: 8, price: 950 },
  { hours: 12, price: 1300 },
  { hours: 16, price: 1650 },
  { hours: 20, price: 2000 },
  { hours: 24, price: 2350 },
  { hours: 28, price: 2634 },
  { hours: 32, price: 2993 },
  { hours: 36, price: 3120.32 },
  { hours: 40, price: 3350 },
  { hours: 44, price: 3472.38 },
  { hours: 48, price: 3591 },
  { hours: 52, price: 3830.4 },
  { hours: 56, price: 4189.5 },
  { hours: 60, price: 4450 },
  { hours: 64, price: 4598.43 },
  { hours: 68, price: 4746.86 },
  { hours: 72, price: 4895.29 },
  { hours: 76, price: 5043.72 },
  { hours: 80, price: 5192.14 },
  { hours: 84, price: 5340.57 },
  { hours: 88, price: 5489 },
  { hours: 92, price: 5637.43 },
  { hours: 96, price: 5785.86},
  { hours: 100, price: 5934.28 },
];
