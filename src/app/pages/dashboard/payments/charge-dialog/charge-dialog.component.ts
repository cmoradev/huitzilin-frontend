import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CreatePayment, PaymentMethod } from '@graphql';

import { CurrencyPipe } from '@angular/common';
import { ChargeFormComponent } from '../charge-form/charge-form.component';
import Decimal from 'decimal.js';
import { MatError } from '@angular/material/form-field';
import { paymentIcons, paymentNames } from '@utils/contains';
import {
  form,
  FormRoot,
  validateTree,
} from '@angular/forms/signals';
import { PaymentFormFields } from '@app/types/payments';

interface ChargeFormFields {
  payments: PaymentFormFields[];
}

@Component({
  selector: 'app-charge-dialog',
  imports: [
    MatDialogModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    CurrencyPipe,
    ChargeFormComponent,
    MatError,
    FormRoot,
  ],
  templateUrl: './charge-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class ChargeDialogComponent {
  private readonly _dialogRef = inject(MatDialogRef<ChargeDialogComponent>);

  public readonly total = inject<number>(MAT_DIALOG_DATA);
  public readonly loading = signal<boolean>(false);

  public readonly paymentNames: any = paymentNames;
  public readonly paymentIcons: any = paymentIcons;

  public readonly paymentsModel = signal<ChargeFormFields>({
    payments: [
      this._createEmptyPayment(PaymentMethod.Transfer),
      this._createEmptyPayment(PaymentMethod.Card),
      this._createEmptyPayment(PaymentMethod.Cash),
    ],
  });

  public readonly chargeForm = form(this.paymentsModel, (schema) => {
    validateTree(schema, ({ valueOf }) => {
      const payments = valueOf(schema.payments);

      if (!payments || payments.length === 0) {
        return null;
      }

      const totalReceived = payments.reduce(
        (acc, current) => acc.add(current.amount ?? 0),
        new Decimal(0)
      );

      const totalDecimal = new Decimal(this.total);
      const remaining = totalDecimal.sub(totalReceived);

      if (!remaining.greaterThan(-0.01)) {
        return {
          kind: 'totalExceeded',
          message: 'El total recibido excede la deuda total',
        };
      }

      return null;
    });
  });

  public readonly remainingAmount = computed(() => {
    const payments = this.paymentsModel().payments;

    const totalReceived = payments.reduce(
      (acc, current) => acc.add(current.amount ?? 0),
      new Decimal(0)
    );

    return new Decimal(this.total).sub(totalReceived).toNumber();
  });

  public readonly receivedPayments = computed(() =>
    this.paymentsModel().payments.filter((payment) => !!payment.amount)
  );

  constructor() {
    effect(() => {
      this._dialogRef.disableClose = this.loading();
    });

    effect(() => {
      // Recalcula la validación cruzada cuando cambian los montos.
      const _ = this.paymentsModel().payments.map((p) => p.amount);
      this.chargeForm();
    });
  }

  public updatePayment(index: number, updated: PaymentFormFields): void {
    this.paymentsModel.update((current) => ({
      payments: current.payments.map((payment, idx) =>
        idx === index ? updated : payment
      ),
    }));
  }

  public submit(): void {
    this.chargeForm().markAsTouched();

    if (this.chargeForm().invalid()) {
      return;
    }

    const received = this.receivedPayments();

    if (received.length === 0) {
      return;
    }

    this.loading.set(true);

    const payments: CreatePayment[] = received.map((payment) => ({
      method: payment.method,
      amount: payment.amount,
      date: payment.date,
      transaction: payment.transaction,
      bank: payment.bank,
    }));

    this._dialogRef.close(payments);
  }

  private _createEmptyPayment(method: PaymentMethod): PaymentFormFields {
    return {
      method,
      amount: 0,
      date: new Date().toISOString(),
      transaction: '',
      bank: '',
    };
  }
}