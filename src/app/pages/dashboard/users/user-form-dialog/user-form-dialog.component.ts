import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  CreateOneUserGQL,
  GetUsersPageGQL,
  UpdateOneUserGQL,
  UserPartsFragment,
} from '@graphql';
import { BranchToolsService, CycleToolsService } from '@services';
import {
  applyWhen,
  email,
  form,
  FormField,
  FormRoot,
  maxLength,
  minLength,
  required,
  validateAsync,
} from '@angular/forms/signals';
import { rxResource } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { UserFormFields } from '@app/types/users';

@Component({
  selector: 'app-user-form-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormField,
    FormRoot,
  ],
  templateUrl: './user-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class UserFormDialogComponent implements OnInit {
  public loading = signal<boolean>(false);
  public data = inject<UserPartsFragment | null>(MAT_DIALOG_DATA);

  private readonly _dialogRef = inject(MatDialogRef<UserFormDialogComponent>);
  private readonly _createOneUser = inject(CreateOneUserGQL);
  private readonly _updateOneUser = inject(UpdateOneUserGQL);
  private readonly _getUsersPage = inject(GetUsersPageGQL);

  public branchTools = inject(BranchToolsService);
  public cycleTools = inject(CycleToolsService);

  public readonly isEditing = computed(() => !!this.data?.id);

  private readonly _initialModel = computed<UserFormFields>(() => ({
    username: this.data?.username ?? '',
    password: '',
    email: this.data?.email ?? '',
    branchId: this.data?.branchId ?? null,
    cycleId: this.data?.cycleId ?? null,
  }));

  public readonly userModel = linkedSignal<UserFormFields, UserFormFields>({
    source: this._initialModel,
    computation: (initial) => ({ ...initial }),
  });

  public readonly userForm = form(this.userModel, (schema) => {
    required(schema.username, { message: 'Campo requerido' });
    minLength(schema.username, 4, { message: 'Mínimo 4 caracteres' });
    required(schema.email, { message: 'Campo requerido' });
    email(schema.email, { message: 'Dirección de correo electrónico válida' });
    maxLength(schema.email, 64, { message: 'Máximo 64 caracteres' });
    required(schema.branchId, { message: 'Seleccione una sucursal' });
    required(schema.cycleId, { message: 'Seleccione un ciclo' });

    // Contraseña sólo obligatoria al crear (en edición el API no la recibe).
    applyWhen(
      schema,
      () => !this.isEditing(),
      (schema) => {
        required(schema.password, { message: 'Campo requerido' });
        minLength(schema.password, 8, { message: 'Mínimo 8 caracteres' });
      }
    );

    // Validación asíncrona: verifica que el username no exista, salvo
    // cuando coincide con el valor inicial al editar.
    validateAsync(schema.username, {
      params: ({ value }) => {
        const current = value();
        if (current.length < 4) return undefined;
        if (current === this.data?.username) return undefined;
        return current;
      },
      debounce: 300,
      factory: (params) =>
        rxResource({
          params,
          stream: ({ params: term }) =>
            this._getUsersPage.fetch({
              variables: {
                filter: {
                  username: { eq: term },
                },
              },
              fetchPolicy: 'network-only',
            }),
        }),
      onSuccess: (response) => {
        if (response.error) {
          return { kind: 'notAvailable', message: 'No se pudo verificar el usuario' };
        }
        const user = response.data?.users?.nodes?.find(
          (value) => value?.id
        );
        return user
          ? { kind: 'usernameIsExists', message: 'El nombre de usuario ya existe en la base de datos' }
          : null;
      },
      onError: () => ({
        kind: 'notAvailable',
        message: 'No se pudo verificar el usuario',
      }),
    });
  });

  constructor() {
    effect(() => {
      this._dialogRef.disableClose = this.loading();
    });
  }

  ngOnInit(): void {
    this.branchTools.fetchAll();
    this.cycleTools.fetchAll();
  }

  public async submit(): Promise<void> {
    if (this.userForm().invalid()) {
      return;
    }

    const values = this.userModel();
    this.loading.set(true);

    try {
      if (this.isEditing()) {
        const updated = await firstValueFrom(
          this._updateOneUser.mutate({
            variables: {
              id: this.data!.id,
              update: {
                email: values.email,
                username: values.username,
                branchId: values.branchId,
                cycleId: values.cycleId,
              },
            },
          })
        );

        this._dialogRef.close(updated.data?.updateOneUser);
      } else {
        const created = await firstValueFrom(
          this._createOneUser.mutate({
            variables: {
              input: {
                email: values.email,
                username: values.username,
                password: values.password,
                branchId: values.branchId,
                cycleId: values.cycleId,
              },
            },
          })
        );

        this._dialogRef.close(created.data?.signUp);
      }
    } catch (error) {
      console.error('Error guardando usuario:', error);
    } finally {
      this.loading.set(false);
    }
  }
}
