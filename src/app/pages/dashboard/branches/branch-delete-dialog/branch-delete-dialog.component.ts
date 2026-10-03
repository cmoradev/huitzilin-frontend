import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { AvatarComponent } from '@components/avatar/avatar.component';
import { BranchPartsFragment, DeleteOneBranchGQL } from '@graphql';

@Component({
  selector: 'app-branch-delete-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    AvatarComponent,
  ],
  templateUrl: './branch-delete-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class BranchDeleteDialogComponent {
  public loading = signal(false);

  public data: BranchPartsFragment = inject(MAT_DIALOG_DATA);

  private readonly _deleteOneBranch = inject(DeleteOneBranchGQL);
  private readonly _dialogRef = inject(
    MatDialogRef<BranchDeleteDialogComponent>
  );

  public delete() {
    if (!!this.data.id) {
      this.loading.set(true);

      this._deleteOneBranch
        .mutate({ variables: { id: this.data.id } })
        .subscribe({
          next: (branch) => {
            this._dialogRef.close(branch.data?.deleteOneBranch);
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
