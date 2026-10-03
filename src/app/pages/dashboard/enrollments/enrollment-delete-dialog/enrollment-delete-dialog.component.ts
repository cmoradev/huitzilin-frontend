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
import { DeleteOneEnrollmentGQL, EnrollmentPartsFragment } from '@graphql';
import { EnrollmentStatePipe } from '@pipes';

@Component({
  selector: 'app-enrollment-delete-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    EnrollmentStatePipe,
  ],
  templateUrl: './enrollment-delete-dialog.component.html',
  styles: ``,
})
export class EnrollmentDeleteDialogComponent {
  public loading = signal(false);

  public data: EnrollmentPartsFragment = inject(MAT_DIALOG_DATA);

  private readonly _deleteOneEnrollment = inject(DeleteOneEnrollmentGQL);
  private readonly _dialogRef = inject(
    MatDialogRef<EnrollmentDeleteDialogComponent>
  );

  public delete() {
    if (!!this.data.id) {
      this.loading.set(true);

      this._deleteOneEnrollment
        .mutate({ variables: { id: this.data.id } })
        .subscribe({
        next: (branch) => {
          this._dialogRef.close(branch.data?.deleteOneEnrollment);
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
