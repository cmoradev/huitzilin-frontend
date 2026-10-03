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
import { AvatarComponent } from '@components/avatar/avatar.component';
import {
  DeleteOneStudentGQL,
  StudentPartsFragment,
} from '@graphql';

@Component({
  selector: 'app-student-delete-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    AvatarComponent,
  ],
  templateUrl: './student-delete-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class StudentDeleteDialogComponent {
  public loading = signal(false);

  public data: StudentPartsFragment = inject(MAT_DIALOG_DATA);

  private readonly _deleteOneStudentGQL = inject(DeleteOneStudentGQL);
  private readonly _dialogRef = inject(
    MatDialogRef<StudentDeleteDialogComponent>
  );

  public delete() {
    if (!!this.data.id) {
      this.loading.set(true);

      this._deleteOneStudentGQL
        .mutate({ variables: { id: this.data.id } })
        .subscribe({
          next: (student) => {
            this._dialogRef.close(student.data?.deleteOneStudent);
          },
          error: (err) => {
            console.error('DELETE STUDENT ERROR: ', err);
          },
          complete: () => {
            this.loading.set(false);
          },
        });
    }
  }
}
