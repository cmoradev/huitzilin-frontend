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
import {
  CreateManyDebitsGQL,
  DebitState,
  Frequency,
} from '@graphql';
import { GlobalStateService } from '@services';
import {
  addMonths,
  endOfMonth,
  format,
  isBefore,
  setDate,
  startOfMonth,
} from 'date-fns';
import Decimal from 'decimal.js';
import { firstValueFrom, map } from 'rxjs';
import { DebitWithDiscountFormComponent } from '../debit-with-discount-form/debit-with-discount-form.component';
import {
  calculateBaseAndTaxFromTotal,
} from '@calculations';
import { DELINQUENCY_VALUE } from '@utils/contains';
import { CatalogDebitFields } from '@app/types/debits';

@Component({
  selector: 'app-light-on-prices',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatExpansionModule,
    DebitWithDiscountFormComponent,
  ],
  templateUrl: './light-on-prices.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class LightOnPricesComponent implements OnInit {
  private readonly _globalState = inject(GlobalStateService);
  private readonly _createManyDebits = inject(CreateManyDebitsGQL);
  private readonly _dialogRef = inject(MatDialogRef<LightOnPricesComponent>);

  public readonly hours = signal<number>(
    this._globalState.enrollment!.hours || 0
  );

  public readonly debits = signal<CatalogDebitFields[]>([]);
  public readonly loading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const value = this.hours();
      if (typeof value === 'number' && value >= 0) {
        this.setPlan(value);
      }
    });

    effect(() => {
      this._dialogRef.disableClose = this.loading();
    });
  }

  ngOnInit(): void {
    this.setPlan(this.hours());
  }

  public onHoursChange(value: number): void {
    if (typeof value === 'number' && !isNaN(value)) {
      this.hours.set(value);
    }
  }

  public updateDebit(index: number, updated: CatalogDebitFields): void {
    this.debits.update((current) =>
      current.map((entry, idx) => (idx === index ? updated : entry))
    );
  }

  public removeDebit(index: number): void {
    this.debits.update((current) => current.filter((_, idx) => idx !== index));
  }

  private setPlan(hours: number): void {
    const enrollment = this._globalState.enrollment;
    if (!enrollment?.start || !enrollment.end) {
      return;
    }

    let packagePrice = 0;
    let remainingHours = hours;

    const packageData = PRICE_LIST.slice()
      .reverse()
      .find((p) => p.hours <= hours);

    if (packageData) {
      packagePrice = packageData.price;
      remainingHours = hours - packageData.hours;
    }

    const extraPrice = remainingHours * HOUR_PRICE;
    const totalPrice = packagePrice + extraPrice;
    const { amount } = calculateBaseAndTaxFromTotal(totalPrice);

    const startPeriod = startOfMonth(`${enrollment.start}T12:00:00`);
    const endPeriod = endOfMonth(`${enrollment.end}T12:00:00`);

    const generated: CatalogDebitFields[] = [];
    let currentDate = startPeriod;

    while (isBefore(currentDate, endPeriod)) {
      currentDate = setDate(currentDate, 5);

      const description = `Mensualidad - ${format(currentDate, 'MMMM')}`;

      generated.push({
        quantity: 1,
        dueDate: format(currentDate, 'yyyy-MM-dd') + 'T12:00:00',
        description,
        withTax: true,
        unitPrice: amount,
        state: DebitState.Debt,
        frequency: Frequency.Single,
        amount,
        delinquency: DELINQUENCY_VALUE,
        discount: 0,
        discounts: [],
      });

      currentDate = addMonths(currentDate, 1);
    }

    this.debits.set(generated);
  }

  public async submit(): Promise<void> {
    if (this.debits().length === 0) {
      return;
    }

    this.loading.set(true);

    try {
      const enrollment = this._globalState.enrollment;
      const student = this._globalState.student;
      const branch = this._globalState.branch;

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
              discounts: debit.discounts.map((discount) => ({
                id: discount.id,
              })),
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
  { hours: 96, price: 5785.86 },
  { hours: 100, price: 5934.28 },
];