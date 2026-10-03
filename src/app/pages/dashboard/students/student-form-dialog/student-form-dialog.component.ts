import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  OnInit,
  signal,
} from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
  FetchStudentGQL,
  StudentPartsFragment,
  UpdateOneStudentGQL,
} from '@graphql';
import {
  applyWhen,
  form,
  FormField,
  FormRoot,
  maxLength,
  required,
  validateAsync,
} from '@angular/forms/signals';
import { rxResource } from '@angular/core/rxjs-interop';
import { BranchToolsService, StorageService } from '@services';
import { firstValueFrom, switchMap } from 'rxjs';
import { StudentFormFields } from '@app/types/students';

@Component({
  selector: 'app-student-form-dialog',
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
    FormField,
    FormRoot,
  ],
  templateUrl: './student-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class StudentFormDialogComponent implements OnInit {
  public loading = signal(false);
  public data: StudentPartsFragment | null = inject(MAT_DIALOG_DATA);
  public readonly _storage = inject(StorageService);

  public branchTools = inject(BranchToolsService);
  private readonly _createOneStudent = inject(CreateOneStudentGQL);
  private readonly _updateOneStudent = inject(UpdateOneStudentGQL);
  private readonly _fetchStudentGQL = inject(FetchStudentGQL);

  private readonly _dialogRef = inject(
    MatDialogRef<StudentFormDialogComponent>
  );

  private previousPicture = signal('');

  public readonly isEditing = computed(() => !!this.data?.id);

  private readonly _initialModel = computed<StudentFormFields>(() => ({
    picture: this.data?.picture ?? '',
    firstname: this.data?.firstname ?? '',
    lastname: this.data?.lastname ?? '',
    dni: this.data?.dni ?? '',
    dateBirth:
      this.data?.dateBirth ?? new Date(2010, 1, 1, 0).toISOString().slice(0, 10),
    active: this.data?.active ?? true,
    branchIds: this.data?.branchs.map((branch) => branch.id) ?? [],
  }));

  public readonly studentModel = linkedSignal<
    StudentFormFields,
    StudentFormFields
  >({
    source: this._initialModel,
    computation: (initial) => ({ ...initial }),
  });

  public readonly studentForm = form(this.studentModel, (schema) => {
    required(schema.firstname, { message: 'Campo requerido' });
    maxLength(schema.firstname, 32, { message: 'Máximo 32 caracteres' });
    required(schema.lastname, { message: 'Campo requerido' });
    maxLength(schema.lastname, 32, { message: 'Máximo 32 caracteres' });
    required(schema.dni, { message: 'Campo requerido' });
    maxLength(schema.dni, 32, { message: 'Máximo 32 caracteres' });
    required(schema.dateBirth, { message: 'Campo requerido' });
    required(schema.branchIds, { message: 'Seleccione al menos una sucursal' });

    // La imagen sólo es obligatoria al crear (no debe bloquear la
    // edición de registros que no tienen imagen).
    applyWhen(
      schema,
      ({ valueOf }) =>
        !this.isEditing() &&
        (!valueOf(schema.picture) || valueOf(schema.picture) === ''),
      (schema) => {
        required(schema.picture, { message: 'Seleccione una imagen' });
      }
    );

    // Validación asíncrona del DNI: verifica que no exista otro
    // estudiante con el mismo DNI/código en la base de datos.
    validateAsync(schema.dni, {
      params: ({ value }) => {
        const current = value();
        if (!current) return undefined;
        if (current === this.data?.dni) return undefined;
        return current;
      },
      debounce: 300,
      factory: (params) =>
        rxResource({
          params,
          stream: ({ params: term }) =>
            this._fetchStudentGQL.fetch({
              variables: {
                limit: 5,
                offset: 0,
                filter: {
                  or: [
                    { code: { eq: term } },
                    { dni: { eq: term } },
                  ],
                },
              },
              fetchPolicy: 'network-only',
            }),
        }),
      onSuccess: (response) => {
        if (response.error) {
          return { kind: 'notAvailable', message: 'No se pudo verificar el DNI' };
        }
        const student = response.data?.students?.nodes?.find(
          (value) => value?.id
        );
        return student
          ? { kind: 'dniIsExists', message: 'El DNI ya existe en la base de datos' }
          : null;
      },
      onError: () => ({
        kind: 'notAvailable',
        message: 'No se pudo verificar el DNI',
      }),
    });
  });

  // El checkbox se enlaza directamente mediante `[formField]="studentForm.active"`,
  // que ya implementa `FormCheckboxControl` a través del field state interno.

  constructor() {
    effect(() => {
      this._dialogRef.disableClose = this.loading();
    });

    effect(() => {
      const data = this.data;
      if (data?.picture) {
        this.previousPicture.set(data.picture);
      }
    });
  }

  ngOnInit(): void {
    this.branchTools.fetchAll();
  }

  public async submit(): Promise<void> {
    if (this.studentForm().invalid()) {
      return;
    }

    const values = this.studentModel();
    this.loading.set(true);

    try {
      const student = this.isEditing()
        ? await this._update(values)
        : await this._save(values);

      this._dialogRef.close(student);
    } catch (err) {
      console.error(
        this.isEditing()
          ? 'UPDATE STUDENT ERROR: '
          : 'CREATE STUDENT ERROR: ',
        err
      );
    } finally {
      this.loading.set(false);
    }
  }

  private async _update(values: StudentFormFields) {
    const { picture, branchIds } = values;
    const uploaded = await this._resolvePicture(picture);

    const updated = await firstValueFrom(
      this._updateOneStudent.mutate({
        variables: {
          id: this.data!.id,
          update: {
            picture: uploaded,
            firstname: values.firstname,
            lastname: values.lastname,
            dateBirth: values.dateBirth,
            dni: values.dni,
            active: values.active,
            branchs: branchIds.map((branchId) => ({ id: branchId })),
          },
        },
      })
    );

    return updated.data?.updateOneStudent;
  }

  private async _save(values: StudentFormFields) {
    const { picture, branchIds } = values;

    if (!(picture instanceof File)) {
      throw new Error('La imagen es requerida para crear un estudiante');
    }

    const created = await firstValueFrom(
      this._storage.upload(picture).pipe(
        switchMap((url) =>
          this._createOneStudent.mutate({
            variables: {
              student: {
                picture: url,
                firstname: values.firstname,
                lastname: values.lastname,
                dateBirth: values.dateBirth,
                dni: values.dni,
                active: values.active,
                branchs: branchIds.map((branchId) => ({ id: branchId })),
              },
            },
          })
        )
    ));

    return created.data?.createOneStudent;
  }

  private async _resolvePicture(picture: File | string): Promise<string> {
    if (picture instanceof File) {
      return firstValueFrom(
        this._storage.delete(this.previousPicture()).pipe(
          switchMap(() => this._storage.upload(picture))
        )
      );
    }

    return picture;
  }
}
