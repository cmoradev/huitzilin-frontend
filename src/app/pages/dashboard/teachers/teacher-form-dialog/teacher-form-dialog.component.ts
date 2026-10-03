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
  CreateOneTeacherGQL,
  TeacherPartsFragment,
  UpdateOneTeacherGQL,
} from '@graphql';
import { BranchToolsService, StorageService } from '@services';
import {
  applyWhen,
  form,
  FormField,
  FormRoot,
  maxLength,
  required,
} from '@angular/forms/signals';
import { firstValueFrom, switchMap } from 'rxjs';
import { TeacherFormFields } from '@app/types/teachers';

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
    FormField,
    FormRoot,
  ],
  templateUrl: './teacher-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class TeacherFormDialogComponent implements OnInit {
  public loading = signal<boolean>(false);
  public data: TeacherPartsFragment | null = inject(MAT_DIALOG_DATA);
  public readonly _storage = inject(StorageService);

  public branchTools = inject(BranchToolsService);
  private readonly _createOneTeacher = inject(CreateOneTeacherGQL);
  private readonly _updateOneTeacher = inject(UpdateOneTeacherGQL);

  private readonly _dialogRef = inject(
    MatDialogRef<TeacherFormDialogComponent>
  );

  private previousPicture = signal('');

  public readonly isEditing = computed(() => !!this.data?.id);

  private readonly _initialModel = computed<TeacherFormFields>(() => ({
    picture: this.data?.picture ?? '',
    firstname: this.data?.firstname ?? '',
    lastname: this.data?.lastname ?? '',
    branchIds: this.data?.branchs.map((branch) => branch.id) ?? [],
  }));

  public readonly teacherModel = linkedSignal<TeacherFormFields, TeacherFormFields>({
    source: this._initialModel,
    computation: (initial) => ({ ...initial }),
  });

  public readonly teacherForm = form(this.teacherModel, (schema) => {
    required(schema.firstname, { message: 'Campo requerido' });
    maxLength(schema.firstname, 32, { message: 'Máximo 32 caracteres' });
    required(schema.lastname, { message: 'Campo requerido' });
    maxLength(schema.lastname, 32, { message: 'Máximo 32 caracteres' });
    required(schema.branchIds, { message: 'Seleccione al menos una sucursal' });

    // La imagen es obligatoria únicamente al crear.
    applyWhen(
      schema,
      ({ valueOf }) =>
        !this.isEditing() &&
        (!valueOf(schema.picture) || valueOf(schema.picture) === ''),
      (schema) => {
        required(schema.picture, { message: 'Seleccione una imagen' });
      }
    );
  });

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
    if (this.teacherForm().invalid()) {
      return;
    }

    const values = this.teacherModel();
    this.loading.set(true);

    try {
      const teacher = this.isEditing()
        ? await this._update(values)
        : await this._save(values);

      this._dialogRef.close(teacher);
    } catch (err) {
      console.error(
        this.isEditing()
          ? 'UPDATE TEACHER ERROR: '
          : 'CREATE TEACHER ERROR: ',
        err
      );
    } finally {
      this.loading.set(false);
    }
  }

  private async _update(values: TeacherFormFields) {
    const { picture, firstname, lastname, branchIds } = values;

    const uploaded = await this._resolvePicture(picture);

    const updated = await firstValueFrom(
      this._updateOneTeacher.mutate({
        variables: {
          id: this.data!.id,
          update: {
            picture: uploaded,
            firstname,
            lastname,
            branchs: branchIds.map((branchId) => ({ id: branchId })),
          },
        },
      })
    );

    return updated.data?.updateOneTeacher;
  }

  private async _save(values: TeacherFormFields) {
    const { picture, firstname, lastname, branchIds } = values;

    if (!(picture instanceof File)) {
      throw new Error('La imagen es requerida para crear un docente');
    }

    const uploaded = await firstValueFrom(
      this._storage.upload(picture).pipe(
        switchMap((url) =>
          this._createOneTeacher.mutate({
            variables: {
              teacher: {
                picture: url,
                firstname,
                lastname,
                branchs: branchIds.map((branchId) => ({ id: branchId })),
              },
            },
          })
        )
    ));

    return uploaded.data?.createOneTeacher;
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
