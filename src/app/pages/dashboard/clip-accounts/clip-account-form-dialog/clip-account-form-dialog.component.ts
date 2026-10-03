import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  ClipAccountPartsFragment,
  CreateClipAccount,
  CreateOneClipAccountGQL,
  UpdateClipAccount,
  UpdateOneClipAccountGQL,
} from '@graphql';
import {
  form,
  FormField,
  FormRoot,
  maxLength,
  required,
} from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { ClipAccountFormFields } from '@app/types/codes';

@Component({
  selector: 'app-clip-account-form-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    FormField,
    MatButtonModule,
    FormRoot,
  ],
  templateUrl: './clip-account-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class ClipAccountFormDialogComponent {
  public readonly data: ClipAccountPartsFragment | null = inject(MAT_DIALOG_DATA);

  private readonly _createOneClipAccount = inject(CreateOneClipAccountGQL);
  private readonly _updateOneClipAccount = inject(UpdateOneClipAccountGQL);

  private readonly _dialogRef = inject(
    MatDialogRef<ClipAccountFormDialogComponent>
  );

  public readonly isEditing = computed(() => !!this.data?.id);

  private readonly _initialModel = computed<ClipAccountFormFields>(() => ({
    name: this.data?.name ?? '',
    token: '',
    webhook: this.data?.webhook ?? '',
    default: this.data?.default ?? '',
    success: this.data?.success ?? '',
    error: this.data?.error ?? '',
  }));

  public readonly accountModel = linkedSignal<ClipAccountFormFields, ClipAccountFormFields>({
    source: this._initialModel,
    computation: (initial) => ({ ...initial }),
  });

  public readonly accountForm = form(this.accountModel, (schema) => {
    required(schema.name, { message: 'Campo requerido' });
    maxLength(schema.name, 64, { message: 'Máximo 64 caracteres' });
    required(schema.webhook, { message: 'Campo requerido' });
    required(schema.default, { message: 'Campo requerido' });
    required(schema.success, { message: 'Campo requerido' });
    required(schema.error, { message: 'Campo requerido' });
  });

  public readonly submitting = signal(false);

  constructor() {
    effect(() => {
      this._dialogRef.disableClose = this.submitting();
    });
  }

  public async submit(): Promise<void> {
    const values = this.accountModel();
    const editing = this.isEditing();

    if (this.accountForm().invalid()) {
      this.accountForm().markAsTouched();
      return;
    }

    // Al editar, el token es opcional. Marcamos el campo como tocado para
    // que el template muestre el mensaje en caso de ser requerido.
    if (!editing && !values.token) {
      this.accountForm.token().markAsTouched();
      return;
    }

    this.submitting.set(true);

    try {
      if (editing) {
        const payload: UpdateClipAccount = { name: values.name };
        if (values.token !== '') {
          payload.token = values.token;
        }

        const updated = await firstValueFrom(
          this._updateOneClipAccount.mutate({
            variables: {
              id: this.data!.id,
              update: payload,
            },
          })
        );

        this._dialogRef.close(updated.data?.updateOneClipAccount);
      } else {
        const created = await firstValueFrom(
          this._createOneClipAccount.mutate({
            variables: {
              account: { ...values } as CreateClipAccount,
            },
          })
        );

        this._dialogRef.close(created.data?.createOneClipAccount);
      }
    } catch (err) {
      console.error(
        editing ? 'UPDATE CYCLE ERROR: ' : 'CREATE CYCLE ERROR: ',
        err
      );
    } finally {
      this.submitting.set(false);
    }
  }
}