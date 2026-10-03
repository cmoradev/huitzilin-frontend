import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { AvatarComponent } from '@components/avatar/avatar.component';
import { DeleteOneTeacherGQL, TeacherPartsFragment } from '@graphql';

@Component({
  selector: 'app-teacher-delete-dialog',
  imports: [MatDialogModule, MatButtonModule, AvatarComponent],
  templateUrl: './teacher-delete-dialog.component.html',
  styles: ``,
})
export class TeacherDeleteDialogComponent {
  public loading = signal(false);

  public data: TeacherPartsFragment = inject(MAT_DIALOG_DATA);

  private readonly _deleteOneTeacherGQL = inject(DeleteOneTeacherGQL);
  private readonly _dialogRef = inject(
    MatDialogRef<TeacherDeleteDialogComponent>
  );

  public delete() {
    if (!!this.data.id) {
      this.loading.set(true);

      this._deleteOneTeacherGQL
        .mutate({ variables: { id: this.data.id } })
        .subscribe({
        next: (teacher) => {
          this._dialogRef.close(teacher.data?.deleteOneTeacher);
        },
        error: (err) => {
          console.error('DELETE TEACHER ERROR: ', err);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
    }
  }
}
