import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DeleteOneLevelGQL, LevelPartsFragment } from '@graphql';

@Component({
  selector: 'app-level-delete-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './level-delete-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class LevelDeleteDialogComponent {
  public loading = signal(false);

  public data: LevelPartsFragment = inject(MAT_DIALOG_DATA);

  private readonly _deleteOneLevel = inject(DeleteOneLevelGQL);
  private readonly _dialogRef = inject(
    MatDialogRef<LevelDeleteDialogComponent>
  );

  public delete() {
    if (!!this.data.id) {
      this.loading.set(true);

      this._deleteOneLevel
        .mutate({ variables: { id: this.data.id } })
        .subscribe({
        next: (cycle) => {
          this._dialogRef.close(cycle.data?.deleteOneLevel);
        },
        error: (err) => {
          console.error('DELETE LEVEL ERROR: ', err);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
    }
  }
}
