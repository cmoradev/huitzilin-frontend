import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DebitPartsFragment, DeleteOneDebitGQL } from '@graphql';
import { DebitStatePipe } from '@pipes';

@Component({
  selector: 'app-debit-delete-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    DebitStatePipe,
    DatePipe,
  ],
  templateUrl: './debit-delete-dialog.component.html',
  styles: ``,
})
export class DebitDeleteDialogComponent {
  public loading = signal(false);

  public data: DebitPartsFragment = inject(MAT_DIALOG_DATA);

  private readonly _deleteOneDebit = inject(DeleteOneDebitGQL);
  private readonly _dialogRef = inject(
    MatDialogRef<DebitDeleteDialogComponent>
  );

  public delete() {
    if (!!this.data.id) {
      this.loading.set(true);

      this._deleteOneDebit
        .mutate({ variables: { id: this.data.id } })
        .subscribe({
        next: (debit) => {
          this._dialogRef.close(debit.data?.deleteOneDebit);
        },
        error: (err) => {
          console.error('DELETE ENROLLMENT ERROR: ', err);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
    }
  }
}
