import { Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { CyclePartsFragment, DeleteOneCycleGQL } from '@graphql';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-cycle-delete-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
  ],
  templateUrl: './cycle-delete-dialog.component.html',
  styles: ``,
})
export class CycleDeleteDialogComponent {
  public loading = signal(false);

  public data: CyclePartsFragment = inject(MAT_DIALOG_DATA);

  private readonly _deleteOneCycle = inject(DeleteOneCycleGQL);
  private readonly _dialogRef = inject(
    MatDialogRef<CycleDeleteDialogComponent>
  );

  public delete() {
    if (!!this.data.id) {
      this.loading.set(true);

      this._deleteOneCycle
        .mutate({ variables: { id: this.data.id } })
        .subscribe({
        next: (cycle) => {
          this._dialogRef.close(cycle.data?.deleteOneCycle);
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
