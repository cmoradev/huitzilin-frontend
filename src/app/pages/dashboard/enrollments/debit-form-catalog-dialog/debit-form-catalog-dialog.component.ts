import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  CreateManyDebitsGQL,
  DebitState,
  FeePartsFragment,
  Frequency,
  GetFeePageGQL,
  GetFeePageQueryVariables,
} from '@graphql';
import { FrequencyPipe } from '@pipes';
import { GlobalStateService } from '@services';
import {
  addMonths,
  format,
  isBefore,
  startOfMonth,
  endOfMonth,
  setDate,
} from 'date-fns';
import { firstValueFrom, map } from 'rxjs';
import { DebitWithDiscountFormComponent } from '../debit-with-discount-form/debit-with-discount-form.component';
import { DELINQUENCY_VALUE } from '@utils/contains';
import { CatalogDebitFields } from '@app/types/debits';
import { CurrencyPipe } from '@angular/common';

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
  private readonly _globalStateService = inject(GlobalStateService);
  private readonly _createManyDebits = inject(CreateManyDebitsGQL);
  private readonly _feesPageGQL = inject(GetFeePageGQL);
  private readonly _dialogRef = inject(
    MatDialogRef<DebitFormCatalogDialogComponent>
  );

  public readonly fees = signal<FeePartsFragment[]>([]);
  public readonly debits = signal<CatalogDebitFields[]>([]);
  public readonly selectedFeeId = signal<string | null>(null);
  public readonly loading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const id = this.selectedFeeId();
      const fee = id ? this.fees().find((value) => value.id === id) : null;
      if (fee) {
        this.generateDebits(fee);
        // Limpia la selección para permitir elegir otra cuota que
        // reemplace los adeudos generados.
        this.selectedFeeId.set(null);
      }
    });

    effect(() => {
      this._dialogRef.disableClose = this.loading();
    });
  }

  ngOnInit(): void {
    this._fetchAllFees();
  }

  public onFeeChange(id: string | null): void {
    this.selectedFeeId.set(id);
  }

  public updateDebit(index: number, updated: CatalogDebitFields): void {
    this.debits.update((current) =>
      current.map((entry, idx) => (idx === index ? updated : entry))
    );
  }

  public removeDebit(index: number): void {
    this.debits.update((current) => current.filter((_, idx) => idx !== index));
  }

  public async submit(): Promise<void> {
    if (this.debits().length === 0) {
      return;
    }

    this.loading.set(true);

    try {
      const enrollment = this._globalStateService.enrollment;
      const student = this._globalStateService.student;
      const branch = this._globalStateService.branch;

      if (!enrollment?.id || !student?.id || !branch?.id) {
        return;
      }

      const created = await firstValueFrom(
        this._createManyDebits.mutate({
          variables: {
            debits: this.debits().map((debit) => ({
              ...debit,
              paymentDate: null,
              studentId: student.id,
              branchId: branch.id,
              discounts: debit.discounts.map((discount) => ({ id: discount.id })),
              enrollmentId: enrollment.id,
            })),
          },
        })
      );

      this._dialogRef.close(created.data?.createManyDebits);
    } finally {
      this.loading.set(false);
    }
  }

  private generateDebits(value: FeePartsFragment) {
    const enrollment = this._globalStateService.enrollment;
    const generated: CatalogDebitFields[] = [];

    switch (value.frequency) {
      case Frequency.Monthly:
        if (enrollment?.start && enrollment.end) {
          const startPeriod = startOfMonth(`${enrollment.start}T12:00:00`);
          const endPeriod = endOfMonth(`${enrollment.end}T12:00:00`);

          let currentDate = startPeriod;

          while (isBefore(currentDate, endPeriod)) {
            currentDate = setDate(currentDate, 5);

            const description = `${value.name} - ${format(
              currentDate,
              'MMMM'
            )}`;

            generated.push({
              quantity: 1,
              dueDate: format(currentDate, 'yyyy-MM-dd') + 'T12:00:00',
              description,
              withTax: value.withTax,
              unitPrice: value.amount,
              state: DebitState.Debt,
              frequency: Frequency.Single,
              amount: value.amount,
              delinquency: DELINQUENCY_VALUE,
              discount: 0,
              discounts: [],
            });

            currentDate = addMonths(currentDate, 1);
          }
        }

        break;

      default:
        generated.push({
          description: value.name,
          unitPrice: value.amount,
          quantity: 1,
          state: DebitState.Debt,
          dueDate: defaultDueDate,
          withTax: value.withTax,
          frequency: value.frequency,
          amount: value.amount,
          delinquency: DELINQUENCY_VALUE,
          discount: 0,
          discounts: [],
        });
        break;
    }

    this.debits.set(generated);
  }

  private _fetchAllFees(accumulared: FeePartsFragment[] = []): void {
    const enrollment = this._globalStateService.enrollment;
    if (!enrollment?.package?.id) {
      this.fees.set([]);
      return;
    }

    const limit = 50;
    const offset = accumulared.length;

    const params: GetFeePageQueryVariables = {
      filter: {
        packageId: { eq: enrollment.package.id },
      },
      limit,
      offset,
    };

    this._feesPageGQL
      .watch({
        variables: params,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: false,
      })
      .valueChanges.subscribe({
        next: (resp) => {
          const fees = resp.data?.fees;
          if (!fees) {
            return;
          }

          const nodes = (fees.nodes ?? []) as FeePartsFragment[];
          const totalCount = fees.totalCount ?? 0;
          const allItems = accumulared.concat(nodes);

          if (allItems.length >= totalCount) {
            this.fees.set(allItems);
            return;
          }

          this._fetchAllFees(allItems);
        },
        error: (error) => {
          console.error('Error fetching fees', error);
        },
      });
  }
}