import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DeleteOneFeeGQL, FeePartsFragment } from '@graphql';
import { FrequencyPipe } from '@pipes';

@Component({
  selector: 'app-fee-delete-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    CurrencyPipe,
    FrequencyPipe,
  ],
  templateUrl: './fee-delete-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class FeeDeleteDialogComponent {
  public loading = signal(false);

  public data: FeePartsFragment = inject(MAT_DIALOG_DATA);

  private readonly _deleteOneFee = inject(DeleteOneFeeGQL);
  private readonly _dialogRef = inject(MatDialogRef<FeeDeleteDialogComponent>);

  public delete() {
    if (!!this.data.id) {
      this.loading.set(true);

      this._deleteOneFee
        .mutate({ variables: { id: this.data.id } })
        .subscribe({
        next: (branch) => {
          this._dialogRef.close(branch.data?.deleteOneFee);
        },
        error: (err) => {
          console.error('DELETE FEE ERROR: ', err);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
    }
  }
}
