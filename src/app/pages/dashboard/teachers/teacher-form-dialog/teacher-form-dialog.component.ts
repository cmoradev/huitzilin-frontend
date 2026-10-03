import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ImagePickerComponent } from '@components/image-picker/image-picker.component';
import { CreateOneTeacherGQL, TeacherPartsFragment, UpdateOneTeacherGQL } from '@graphql';
import { BranchToolsService, FormToolsService, StorageService } from '@services';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-teacher-form-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    ImagePickerComponent,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './teacher-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class TeacherFormDialogComponent {
  public readonly formTools = inject(FormToolsService);

  public loading = signal<boolean>(false);
  public data: TeacherPartsFragment | null = inject(MAT_DIALOG_DATA);
  public readonly _storage = inject(StorageService);

  public branchTools = inject(BranchToolsService);
  private readonly _createOneTeacher = inject(CreateOneTeacherGQL);
  private readonly _updateOneTeacher = inject(UpdateOneTeacherGQL);

  private readonly _dialogRef = inject(
    MatDialogRef<TeacherFormDialogComponent>
  );

  private previusPicture = '';

  public formGroup = this.formTools.builder.group({
    picture: this.formTools.builder.control<File | string>('', {
      nonNullable: true,
    }),
    firstname: this.formTools.builder.control<string>('', {
      validators: [Validators.required, Validators.maxLength(32)],
      nonNullable: true,
    }),
    lastname: this.formTools.builder.control<string>('', {
      validators: [Validators.required, Validators.maxLength(32)],
      nonNullable: true,
    }),
    branchIds: this.formTools.builder.control<string[]>([], {
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    if (!!this.data?.id) {
      this.formGroup.patchValue({
        picture: this.data.picture,
        firstname: this.data.firstname,
        lastname: this.data.lastname,
        branchIds: this.data.branchs.map((branch) => branch.id),
      });
      this.previusPicture = this.data.picture;
    }
  }

  public async submit(): Promise<void> {
    if (this.formGroup.valid) {
      this.loading.set(true);

      const values = this.formGroup.getRawValue();

      if (!!this.data?.id) {
        this._update(values).subscribe({
          next: (student) => {
            this._dialogRef.close(student);
          },
          error: (err) => {
            console.error('UPDATE STUDENT ERROR: ', err);
          },
          complete: () => {
            this.loading.set(false);
          },
        });
      } else {
        this._save(values).subscribe({
          next: (branch) => {
            this._dialogRef.close(branch);
          },
          error: (err) => {
            console.error('CREATE STUDENT ERROR: ', err);
          },
          complete: () => {
            this.loading.set(false);
          },
        });
      }
    }
  }

  private _update(values: FormValues) {
    const withFile = values.picture instanceof File;

    const uploadPicture$ = withFile
      ? this._storage
          .delete(this.previusPicture)
          .pipe(switchMap(() => this._storage.upload(values.picture as File)))
      : of(this.previusPicture);

    return uploadPicture$.pipe(
      switchMap((picture) =>
        this._updateOneTeacher.mutate({
          variables: {
            id: this.data!.id,
            update: {
              picture,
              firstname: values.firstname,
              lastname: values.lastname,
              branchs: values.branchIds.map((branchId) => ({
                id: branchId,
              })),
            },
          },
        })
      )
    );
  }

  private _save(values: FormValues) {
    const withFile = values.picture instanceof File;

    const uploadPicture$ = withFile
      ? this._storage.upload(values.picture as File)
      : of('images/image-default.png');

    return uploadPicture$.pipe(
      switchMap((picture) =>
        this._createOneTeacher.mutate({
          variables: {
            teacher: {
              picture,
              firstname: values.firstname,
              lastname: values.lastname,
              branchs: values.branchIds.map((branchId) => ({
                id: branchId,
              })),
            },
          },
        })
      )
    );
  }
}

type FormValues = {
  picture: File | string;
  firstname: string;
  lastname: string;
  branchIds: string[];
};
