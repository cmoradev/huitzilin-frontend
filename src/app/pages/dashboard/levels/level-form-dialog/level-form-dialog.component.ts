import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  CreateOneLevelGQL,
  LevelPartsFragment,
  UpdateOneLevelGQL,
} from '@graphql';
import { GlobalStateService } from '@services';
import {
  form,
  FormField,
  FormRoot,
  maxLength,
  required,
} from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { LevelFormFields } from '@app/types/levels';

@Component({
  selector: 'app-level-form-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    MatInputModule,
    MatFormFieldModule,
    FormField,
    FormRoot,
  ],
  templateUrl: './level-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class LevelFormDialogComponent {
  public readonly data: LevelPartsFragment | null = inject(MAT_DIALOG_DATA);

  private readonly _globalStateService = inject(GlobalStateService);
  private readonly _createOneLevel = inject(CreateOneLevelGQL);
  private readonly _updateOneLevel = inject(UpdateOneLevelGQL);

  private readonly _dialogRef = inject(MatDialogRef<LevelFormDialogComponent>);

  public readonly isEditing = computed(() => !!this.data?.id);

  private readonly _initialModel = computed<LevelFormFields>(() => ({
    name: this.data?.name ?? '',
    abbreviation: this.data?.abbreviation ?? '',
  }));

  public readonly levelModel = linkedSignal<LevelFormFields, LevelFormFields>({
    source: this._initialModel,
    computation: (initial) => ({ ...initial }),
  });

  public readonly levelForm = form(this.levelModel, (schema) => {
    required(schema.name, { message: 'Campo requerido' });
    required(schema.abbreviation, { message: 'Campo requerido' });
    maxLength(schema.name, 32, {
      message: 'Máximo 32 caracteres',
    });
    maxLength(schema.abbreviation, 8, {
      message: 'Máximo 8 caracteres',
    });
  });

  public readonly submitting = signal(false);

  constructor() {
    effect(() => {
      this._dialogRef.disableClose = this.submitting();
    });
  }

  public async submit(): Promise<void> {
    if (this.levelForm().invalid()) {
      return;
    }

    const values = this.levelModel();
    this.submitting.set(true);

    try {
      if (this.isEditing()) {
        const updated = await firstValueFrom(
          this._updateOneLevel.mutate({
            variables: {
              id: this.data!.id,
              update: { ...values },
            },
          })
        );

        this._dialogRef.close(updated.data?.updateOneLevel);
      } else if (this._globalStateService.branch?.id) {
        const created = await firstValueFrom(
          this._createOneLevel.mutate({
            variables: {
              level: {
                ...values,
                order: 0,
                branchId: this._globalStateService.branch!.id,
              },
            },
          })
        );

        this._dialogRef.close(created.data?.createOneLevel);
      }
    } catch (err) {
      console.error(
        this.isEditing() ? 'UPDATE LEVEL ERROR: ' : 'CREATE LEVEL ERROR: ',
        err
      );
    } finally {
      this.submitting.set(false);
    }
  }
}