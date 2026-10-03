import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  AccountsReceivablePartsFragment,
  AddPaymentToIncomeGQL,
  CreatePayment,
  DebitPartsFragment,
  GetAccountsReceivableGQL,
} from '@graphql';
import { FolioPipe, MethodPipe } from '@pipes';
import { PosService } from '@services';
import { ChargeDialogComponent } from '../charge-dialog/charge-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

type CompletePaymentDialogData = {
  debit: DebitPartsFragment;
  branchID: string;
  studentID: string;
};

@Component({
  selector: 'app-complete-payment-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatTooltipModule,
    FolioPipe,
    MethodPipe,
    CurrencyPipe,
  ],
  templateUrl: './complete-payment-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class CompletePaymentDialogComponent implements OnInit {
  private readonly _dialogRef = inject(
    MatDialogRef<CompletePaymentDialogComponent>
  );
  private readonly _dialog = inject(MatDialog);
  private readonly _getAccountsReceivable = inject(GetAccountsReceivableGQL);
  private readonly _addPaymentToIncome = inject(AddPaymentToIncomeGQL);
  private readonly _snackBar = inject(MatSnackBar);

  public withNewPayment = signal<boolean>(false);
  public loading = signal<boolean>(false);
  public accountsReceivable = signal<AccountsReceivablePartsFragment | null>(
    null
  );

  ngOnInit(): void {
    this.fetchAccountsReceivable();
  }

  public data = inject<CompletePaymentDialogData>(MAT_DIALOG_DATA);

  public closeDialog() {
    this._dialogRef.close(this.withNewPayment());
  }

  public openChargeDialog() {
    if (
      this.accountsReceivable() &&
      this.accountsReceivable()!.pendingPayment > 0
    ) {
      const $dislog = this._dialog.open<
        ChargeDialogComponent,
        number,
        CreatePayment[]
      >(ChargeDialogComponent, {
        width: '32rem',
        data: this.accountsReceivable()!.pendingPayment,
        disableClose: true,
      });

      $dislog.afterClosed().subscribe({
        next: (payments) => {
          if (!!payments && !!payments.length) {
            this.withNewPayment.set(true);

            this._addPaymentToIncome
              .mutate({
                variables: {
                  input: {
                    incomeID: this.accountsReceivable()!.id,
                    payments,
                  },
                },
              })
              .subscribe({
                next: ({ data }) => {
                  this.loading.set(false);
                  this._snackBar.open(
                    'Se ha agregado el pago correctamente',
                    'Cerrar',
                    {
                      duration: 3000,
                      horizontalPosition: 'center',
                      verticalPosition: 'bottom',
                    }
                  );
                  this.fetchAccountsReceivable();
                },
                error: (error) => {
                  this.loading.set(false);
                },
              });
          }
        },
      });
    }
  }

  private fetchAccountsReceivable() {
    if (this.data?.debit.id) {
      this.loading.set(true);
      this._getAccountsReceivable
        .fetch({
          variables: {
            input: {
              debitId: this.data!.debit.id,
            },
          },
          fetchPolicy: 'network-only',
        })
        .subscribe({
          next: ({ data }) => {
            this.loading.set(false);
            if (data?.getAccountsReceivable) {
              this.accountsReceivable.set(data.getAccountsReceivable);
            }
          },
          error: (error) => {
            // Handle any errors
          },
        });
    }
  }
}
