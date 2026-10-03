import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ImagePickerComponent } from '@components/image-picker/image-picker.component';
import {
  CreateOneStudentGQL,
  StudentPartsFragment,
  UpdateOneStudentGQL,
} from '@graphql';
import {
  BranchToolsService,
  FormToolsService,
  StorageService,
} from '@services';
import { of, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-student-form-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckbox,
    ImagePickerComponent,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './student-form-dialog.component.html',
  styles: ``,
})
export class StudentFormDialogComponent implements OnInit {
  public readonly formTools = inject(FormToolsService);

  public loading = signal(false);
  public data: StudentPartsFragment | null = inject(MAT_DIALOG_DATA);
  public readonly _storage = inject(StorageService);

  public branchTools = inject(BranchToolsService);
  private readonly _createOneStudent = inject(CreateOneStudentGQL);
  private readonly _updateOneStudent = inject(UpdateOneStudentGQL);

  private readonly _dialogRef = inject(
    MatDialogRef<StudentFormDialogComponent>
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
    dni: this.formTools.builder.control<string>('', {
      validators: [Validators.required, Validators.maxLength(32)],
      asyncValidators: [this.formTools.isDniStudentValid],
      nonNullable: true,
    }),
    dateBirth: this.formTools.builder.control<string>(
      new Date(2010, 1, 1, 0).toDateString(),
      {
        validators: [Validators.required],
        nonNullable: true,
      }
    ),
    active: this.formTools.builder.control<boolean>(true, {
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
        dateBirth: this.data.dateBirth,
        dni: this.data.dni,
        active: this.data.active,
        branchIds: this.data.branchs.map((branch) => branch.id),
      });
      this.previusPicture = this.data.picture;

      this.formGroup
        .get('dni')
        ?.valueChanges.pipe(startWith(this.data.dni))
        .subscribe((value) => {
          const dniControl = this.formGroup.get('dni');
          if (value === this.data?.dni) {
            dniControl?.clearAsyncValidators();
          } else {
            dniControl?.setAsyncValidators([this.formTools.isDniStudentValid]);
          }
          dniControl?.updateValueAndValidity({
            onlySelf: true,
            emitEvent: false,
          });
        });
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
        this._updateOneStudent.mutate({
          variables: {
            id: this.data!.id,
            update: {
              picture,
              firstname: values.firstname,
              lastname: values.lastname,
              dateBirth: values.dateBirth,
              dni: values.dni,
              active: values.active,
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
        this._createOneStudent.mutate({
          variables: {
            student: {
              picture,
              firstname: values.firstname,
              lastname: values.lastname,
              dateBirth: values.dateBirth,
              dni: values.dni,
              active: values.active,
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
  dni: string;
  dateBirth: string;
  active: boolean;
  branchIds: string[];
};
