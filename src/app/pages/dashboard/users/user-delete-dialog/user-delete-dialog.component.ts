import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DeleteOneUserGQL, UserPartsFragment } from '@graphql';

@Component({
  selector: 'app-user-delete-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './user-delete-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``
})
export class UserDeleteDialogComponent {
 public loading = signal(false);

  public data: UserPartsFragment = inject(MAT_DIALOG_DATA);

  private readonly _deleteOneUser = inject(DeleteOneUserGQL);
  private readonly _dialogRef = inject(
    MatDialogRef<UserDeleteDialogComponent>
  );

  public delete() {
    if (!!this.data.id) {
      this.loading.set(true);

      this._deleteOneUser
        .mutate({ variables: { id: this.data.id } })
        .subscribe({
        next: (user) => {
          this._dialogRef.close(user.data?.deleteOneUser);
        },
        error: (err) => {
          console.error('DELETE USER ERROR: ', err);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
    }
  }
}
