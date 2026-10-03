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
import { MatButton } from '@angular/material/button';
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
  BranchPartsFragment,
  CreateOneBranchGQL,
  UpdateOneBranchGQL,
} from '@graphql';
import { ClipAccountToolsService, StorageService } from '@services';
import {
  applyWhen,
  form,
  FormField,
  FormRoot,
  maxLength,
  required,
} from '@angular/forms/signals';
import { firstValueFrom, map, switchMap } from 'rxjs';
import { BranchFormFields } from '@app/types/branches';

@Component({
  selector: 'app-form-dialog',
  imports: [
    MatDialogModule,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    ImagePickerComponent,
    MatSelectModule,
    FormField,
    FormRoot,
  ],
  templateUrl: './branch-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class BranchFormDialogComponent implements OnInit {
  public loading = signal(false);
  public data: BranchPartsFragment | null = inject(MAT_DIALOG_DATA);
  public readonly _storage = inject(StorageService);

  private readonly _createOneBranch = inject(CreateOneBranchGQL);
  private readonly _updateOneBranch = inject(UpdateOneBranchGQL);

  private readonly _dialogRef = inject(MatDialogRef<BranchFormDialogComponent>);

  public clipAccountTools = inject(ClipAccountToolsService);

  public readonly isEditing = computed(() => !!this.data?.id);

  private readonly _initialModel = computed<BranchFormFields>(() => ({
    picture: this.data?.picture ?? '',
    name: this.data?.name ?? '',
    clipAccountID: this.data?.clipAccounts.find(() => true)?.id ?? null,
  }));

  public readonly branchModel = linkedSignal<
    BranchFormFields,
    BranchFormFields
  >({
    source: this._initialModel,
    computation: (initial) => ({ ...initial }),
  });

  public readonly branchForm = form(this.branchModel, (schema) => {
    required(schema.name, { message: 'Campo requerido' });
    maxLength(schema.name, 16, { message: 'Máximo 16 caracteres' });

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

  private previousPicture = signal('');

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
    this.clipAccountTools.fetchAll();
  }

  public async submit(): Promise<void> {
    if (this.branchForm().invalid()) {
      return;
    }

    const values = this.branchModel();
    this.loading.set(true);

    try {
      const branch = this.isEditing()
        ? await this._update(values)
        : await this._save(values);

      this._dialogRef.close(branch);
    } catch (err) {
      console.error(
        this.isEditing() ? 'UPDATE BRANCH ERROR: ' : 'CREATE BRANCH ERROR: ',
        err
      );
    } finally {
      this.loading.set(false);
    }
  }

  private async _update(values: BranchFormFields) {
    const { picture, name, clipAccountID } = values;

    if (picture instanceof File) {
      const uploaded = await firstValueFrom(
        this._storage.delete(this.previousPicture()).pipe(
          switchMap(() => this._storage.upload(picture))
        )
      );

      const updated = await firstValueFrom(
        this._updateOneBranch.mutate({
          variables: {
            id: this.data!.id,
            update: {
              picture: uploaded,
              name,
              clipAccounts: clipAccountID ? [{ id: clipAccountID }] : [],
            } as any,
          },
        })
      );

      return updated.data?.updateOneBranch;
    }

    const updated = await firstValueFrom(
      this._updateOneBranch.mutate({
        variables: {
          id: this.data!.id,
          update: {
            name,
            picture,
            clipAccounts: clipAccountID ? [{ id: clipAccountID }] : [],
          } as any,
        },
      })
    );

    return updated.data?.updateOneBranch;
  }

  private async _save(values: BranchFormFields) {
    const { picture, name, clipAccountID } = values;

    if (!(picture instanceof File)) {
      throw new Error('La imagen es requerida para crear una sucursal');
    }

    const uploaded = await firstValueFrom(
      this._storage.upload(picture).pipe(
        switchMap((url) =>
          this._createOneBranch.mutate({
            variables: {
              branch: {
                picture: url,
                name,
                clipAccounts: clipAccountID ? [{ id: clipAccountID }] : [],
              },
            },
          })
        ),
        map((response) => response.data?.createOneBranch)
      )
    );

    return uploaded;
  }
}
