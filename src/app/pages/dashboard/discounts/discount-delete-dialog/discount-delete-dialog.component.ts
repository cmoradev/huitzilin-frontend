import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteOneDiscountGQL, DiscountPartsFragment } from '@graphql';

@Component({
  selector: 'app-discount-delete-dialog',
  imports: [MatDialogModule, MatButtonModule, CurrencyPipe],
  templateUrl: './discount-delete-dialog.component.html',
  styles: ``,
})
export class DiscountDeleteDialogComponent {
  public loading = signal(false);

  public data: DiscountPartsFragment = inject(MAT_DIALOG_DATA);

  private readonly _snackBar = inject(MatSnackBar);
  private readonly _deleteOneDiscount = inject(DeleteOneDiscountGQL);
  private readonly _dialogRef = inject(
    MatDialogRef<DiscountDeleteDialogComponent>
  );

  public delete() {
    if (!!this.data.id) {
      this.loading.set(true);

      this._deleteOneDiscount
        .mutate({ variables: { id: this.data.id } })
        .subscribe({
        next: (cycle) => {
          this._dialogRef.close(cycle.data?.deleteOneDiscount);
          this._snackBar.open('Se ha eliminado correctamente', 'Cerrar', {
            duration: 1000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        },
        error: (err) => {
          console.error('DELETE CYCLE ERROR: ', err);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
    }
  }
}
