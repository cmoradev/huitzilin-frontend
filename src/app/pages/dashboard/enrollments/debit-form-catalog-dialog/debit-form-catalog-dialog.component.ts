import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  FormArray,
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
import { MatSelectModule } from '@angular/material/select';
import {
  CreateDebit,
  CreateManyDebitsGQL,
  DebitState,
  FeePartsFragment,
  Frequency,
  GetFeePageGQL,
  GetFeePageQueryVariables,
} from '@graphql';
import { FrequencyPipe } from '@pipes';
import { FormToolsService, GlobalStateService } from '@services';
import {
  addMonths,
  format,
  isBefore,
  startOfMonth,
  endOfMonth,
  setDate,
} from 'date-fns';
import Decimal from 'decimal.js';
import { map } from 'rxjs';
import { DebitWithDiscountFormComponent } from '../debit-with-discount-form/debit-with-discount-form.component';
import { DELINQUENCY_VALUE } from '@utils/contains';

const defaultDueDate = `${format(
  addMonths(new Date(), 1),
  'yyyy-MM'
)}-05T12:00:00`;

@Component({
  selector: 'app-debit-form-catalog-dialog',
  imports: [
    MatSelectModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    CurrencyPipe,
    FrequencyPipe,
    DebitWithDiscountFormComponent,
  ],
  templateUrl: './debit-form-catalog-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class DebitFormCatalogDialogComponent implements OnInit {
  private readonly _formTools = inject(FormToolsService);
  private readonly _globalStateService = inject(GlobalStateService);
  private readonly _createManyDebits = inject(CreateManyDebitsGQL);
  private readonly _feesPageGQL = inject(GetFeePageGQL);
  private readonly _dialogRef = inject(
    MatDialogRef<DebitFormCatalogDialogComponent>
  );

  public loading = signal<boolean>(false);
  public fees = signal<FeePartsFragment[]>([]);

  public formGroup = this._formTools.builder.group({
    fee: this._formTools.builder.control<FeePartsFragment | null>(null, {
      nonNullable: false,
    }),
    debits: this._formTools.builder.array([]),
  });

  ngOnInit(): void {
    this._fetchAllFees();

    this.formGroup.get('fee')!.valueChanges.subscribe((value) => {
      console.log('Selected fee:', value);
      if (value) {
        this.generateDebits(value);
      }
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
      'enrollmentId' | 'studentId' | 'branchId' | 'paymentDate' | 'discount' | 'delinquency'
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
      delinquency: this._formTools.builder.control<number>(DELINQUENCY_VALUE, {
        validators: [Validators.required, Validators.min(0)],
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

  public submit(): void {
    if (this.formGroup.valid) {
      const values = this.formGroup.getRawValue();

      this.loading.set(true);

      if (
        !!this._globalStateService.enrollment?.id &&
        !!this._globalStateService.student?.id && 
        !!this._globalStateService.branch?.id
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

  private generateDebits(value: FeePartsFragment) {
    this.formGroup.get('fee')!.setValue(null);
    console.log(this._globalStateService!.enrollment, value)
    switch (value.frequency) {
      case Frequency.Monthly:
        if (
          !!this._globalStateService!.enrollment!.start &&
          !!this._globalStateService!.enrollment!.end
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

            const description = `${value.name} - ${format(
              currentDate,
              'MMMM'
            )}`;

            this.addDebit({
              quantity: 1,
              dueDate: format(currentDate, 'yyyy-MM-dd') + 'T12:00:00',
              description,
              withTax: value.withTax,
              unitPrice: value.amount,
              state: DebitState.Debt,
              frequency: Frequency.Single,
            });

            currentDate = addMonths(currentDate, 1);
          }
        }

        break;

      default:
        this.addDebit({
          description: value.name,
          unitPrice: value.amount,
          quantity: 1,
          state: DebitState.Debt,
          dueDate: defaultDueDate,
          withTax: value.withTax,
          frequency: value.frequency,
        });
        break;
    }
  }

  private _fetchAllFees(accumulared: FeePartsFragment[] = []): void {
    if (!!this._globalStateService.enrollment?.package!.id) {
      const limit = 50;
      const offset = accumulared.length;

      const params: GetFeePageQueryVariables = {
        filter: {
          packageId: { eq: this._globalStateService.enrollment?.package!.id },
        },
        limit,
        offset,
      };

      const getFees$ = this._feesPageGQL
        .watch({
          variables: params,
          fetchPolicy: 'cache-and-network', // Usa cache primero, solo pide a la API si no hay datos en cache
          nextFetchPolicy: 'cache-and-network', // Mantiene la política de cache en siguientes peticiones
          notifyOnNetworkStatusChange: false, // No notifica cambios de red para evitar refetch innecesario
        })
        .valueChanges;

      getFees$.pipe(map((resp) => resp.data?.fees)).subscribe({
        next: (fees) => {
          if (!fees) return;

          const nodes = (fees.nodes ?? []) as FeePartsFragment[];
          const totalCount = fees.totalCount ?? 0;

          const allItems = accumulared.concat(nodes);

          if (allItems.length >= totalCount) {
            this.fees.set(allItems);
            return; // No more fees to fetch
          }

          this._fetchAllFees(allItems);
        },
        error: (error) => {
          console.error('Error fetching fees', error);
        },
      });
    } else {
      this.fees.set([]);
    }
  }
}
