import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { PackagePartsFragment, DeleteOnePackageGQL } from '@graphql';

@Component({
  selector: 'app-activity-delete-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
  ],
  templateUrl: './activity-delete-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class ActivityDeleteDialogComponent {
  public loading = signal(false);

  public data: PackagePartsFragment = inject(MAT_DIALOG_DATA);

  private readonly _deleteOnePackage = inject(DeleteOnePackageGQL);
  private readonly _dialogRef = inject(
    MatDialogRef<ActivityDeleteDialogComponent>
  );

  public delete() {
    if (!!this.data.id) {
      this.loading.set(true);

      this._deleteOnePackage
        .mutate({ variables: { id: this.data.id } })
        .subscribe({
        next: (branch) => {
          this._dialogRef.close(branch.data?.deleteOnePackage);
        },
        error: (err) => {
          console.error('DELETE BRANCH ERROR: ', err);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
    }
  }
}
