import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ClipAccountPartsFragment, DeleteOneClipAccountGQL } from '@graphql';

@Component({
  selector: 'app-clip-account-delete-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './clip-account-delete-dialog.component.html',
  styles: ``,
})
export class ClipAccountDeleteDialogComponent {
  public loading = signal(false);

  public data: ClipAccountPartsFragment = inject(MAT_DIALOG_DATA);

  private readonly _deleteOneClipAccount = inject(DeleteOneClipAccountGQL);
  private readonly _dialogRef = inject(
    MatDialogRef<ClipAccountDeleteDialogComponent>
  );

  public delete() {
    if (!!this.data.id) {
      this.loading.set(true);

      this._deleteOneClipAccount
        .mutate({ variables: { id: this.data.id } })
        .subscribe({
        next: ({ data }) => {
          this._dialogRef.close(data?.deleteOneClipAccount);
        },
        error: (err) => {
          console.error('DELETE CLIP ACCOUNT ERROR: ', err);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
    }
  }
}
