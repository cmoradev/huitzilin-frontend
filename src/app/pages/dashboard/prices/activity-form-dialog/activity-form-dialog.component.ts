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
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  PackagePartsFragment,
  CreateOnePackageGQL,
  UpdateOnePackageGQL,
  PackageKind,
} from '@graphql';
import { GlobalStateService } from '@services';
import {
  form,
  FormField,
  FormRoot,
  maxLength,
  minLength,
  required,
} from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { ActivityFormFields } from '@app/types/enrollments';

@Component({
  selector: 'app-activity-form-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormField,
    MatFormFieldModule,
    MatInputModule,
    FormField,
    FormRoot,
  ],
  templateUrl: './activity-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class ActivityFormDialogComponent {
  public readonly data: PackagePartsFragment | null = inject(MAT_DIALOG_DATA);

  private readonly _globalStateService = inject(GlobalStateService);
  private readonly _createOnePackage = inject(CreateOnePackageGQL);
  private readonly _updateOnePackage = inject(UpdateOnePackageGQL);

  private readonly _dialogRef = inject(
    MatDialogRef<ActivityFormDialogComponent>
  );

  public readonly isEditing = computed(() => !!this.data?.id);

  private readonly _initialModel = computed<ActivityFormFields>(() => ({
    name: this.data?.name ?? '',
  }));

  public readonly activityModel = linkedSignal<ActivityFormFields, ActivityFormFields>({
    source: this._initialModel,
    computation: (initial) => ({ ...initial }),
  });

  public readonly activityForm = form(this.activityModel, (schema) => {
    required(schema.name, { message: 'Campo requerido' });
    minLength(schema.name, 3, { message: 'Mínimo 3 caracteres' });
    maxLength(schema.name, 32, { message: 'Máximo 32 caracteres' });
  });

  public readonly submitting = signal(false);

  constructor() {
    effect(() => {
      this._dialogRef.disableClose = this.submitting();
    });
  }

  public async submit(): Promise<void> {
    if (this.activityForm().invalid()) {
      return;
    }

    const values = this.activityModel();
    this.submitting.set(true);

    try {
      if (this.isEditing()) {
        const updated = await firstValueFrom(
          this._updateOnePackage.mutate({
            variables: {
              id: this.data!.id,
              update: { ...this._withDefaults(values) } as any,
            },
          })
        );

        this._dialogRef.close(updated.data?.updateOnePackage);
      } else if (this._globalStateService.branch?.id) {
        const created = await firstValueFrom(
          this._createOnePackage.mutate({
            variables: {
              package: {
                ...this._withDefaults(values),
                branchId: this._globalStateService.branch!.id,
                order: 1,
              },
            },
          })
        );

        this._dialogRef.close(created.data?.createOnePackage);
      }
    } catch (err) {
      console.error(
        this.isEditing() ? 'UPDATE PACKAGE ERROR: ' : 'CREATE PACKAGE ERROR: ',
        err
      );
    } finally {
      this.submitting.set(false);
    }
  }

  private _withDefaults(values: ActivityFormFields) {
    return {
      name: values.name,
      withTax: false,
      kind: PackageKind.Unlimited,
      quantity: 0,
    };
  }
}