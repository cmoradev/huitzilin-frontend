import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteOneDisciplineGQL, DisciplinePartsFragment } from '@graphql';
import { PackageKindPipe } from '@pipes';

@Component({
  selector: 'app-discipline-delete-dialog',
  imports: [MatDialogModule, MatButtonModule, PackageKindPipe],
  templateUrl: './discipline-delete-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``
})
export class DisciplineDeleteDialogComponent {
  public loading = signal<boolean>(false);

  public data: DisciplinePartsFragment = inject(MAT_DIALOG_DATA);

  private readonly _deleteOneDiscipline = inject(DeleteOneDisciplineGQL);
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _dialogRef = inject(
    MatDialogRef<DisciplineDeleteDialogComponent>
  );

  public delete() {
    if (!!this.data.id) {
      this.loading.set(true);

      this._deleteOneDiscipline
        .mutate({ variables: { id: this.data.id } })
        .subscribe({
        next: (cycle) => {
          this._dialogRef.close(cycle.data?.deleteOneDiscipline);
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
