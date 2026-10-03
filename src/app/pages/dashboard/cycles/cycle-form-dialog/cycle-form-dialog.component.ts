import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  CreateOneCycleGQL,
  CyclePartsFragment,
  UpdateOneCycleGQL,
} from '@graphql';
import { firstValueFrom } from 'rxjs';
import {
  form,
  FormField,
  FormRoot,
  maxLength,
  required,
  validateTree,
} from '@angular/forms/signals';
import { CycleFormFields } from '@app/types/cycles';

@Component({
  selector: 'app-cycle-form-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    FormField,
    FormRoot,
  ],
  templateUrl: './cycle-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class CycleFormDialogComponent {
  public loading = signal(false);
  public data: CyclePartsFragment | null = inject(MAT_DIALOG_DATA);

  private readonly _createOneCycle = inject(CreateOneCycleGQL);
  private readonly _updateOneCycle = inject(UpdateOneCycleGQL);

  private readonly _dialogRef = inject(MatDialogRef<CycleFormDialogComponent>);

  public readonly isEditing = computed(() => !!this.data?.id);

  private readonly _initialModel = computed<CycleFormFields>(() => ({
    name: this.data?.name ?? '',
    start: this.data?.start ?? '',
    end: this.data?.end ?? '',
  }));

  public readonly cycleModel = linkedSignal<CycleFormFields, CycleFormFields>({
    source: this._initialModel,
    computation: (initial) => ({ ...initial }),
  });

  public readonly cycleForm = form(this.cycleModel, (schema) => {
    required(schema.name, { message: 'Campo requerido' });
    maxLength(schema.name, 16, { message: 'Máximo 16 caracteres' });
    required(schema.start, { message: 'Seleccione fecha de inicio' });
    required(schema.end, { message: 'Seleccione fecha de fin' });

    validateTree(schema, ({ valueOf }) => {
      const start = valueOf(schema.start);
      const end = valueOf(schema.end);
      if (start && end && new Date(start) >= new Date(end)) {
        return {
          kind: 'endDateInvalid',
          message:
            'La fecha de finalización debe ser mayor a la fecha de inicio',
          fieldTree: this.cycleForm.end,
        };
      }
      return null;
    });
  });

  constructor() {
    effect(() => {
      this._dialogRef.disableClose = this.loading();
    });
  }

  public async submit(): Promise<void> {
    if (this.cycleForm().invalid()) {
      return;
    }

    const values = this.cycleModel();
    this.loading.set(true);

    try {
      const cycle = this.isEditing()
        ? await this._update(values)
        : await this._save(values);

      this._dialogRef.close(cycle);
    } catch (err) {
      console.error(
        this.isEditing() ? 'UPDATE CYCLE ERROR: ' : 'CREATE CYCLE ERROR: ',
        err
      );
    } finally {
      this.loading.set(false);
    }
  }

  private async _update(values: CycleFormFields) {
    const updated = await firstValueFrom(
      this._updateOneCycle.mutate({
        variables: {
          id: this.data!.id,
          update: this._buildPayload(values),
        },
      })
    );

    return updated.data?.updateOneCycle;
  }

  private async _save(values: CycleFormFields) {
    const created = await firstValueFrom(
      this._createOneCycle.mutate({
        variables: {
          cycle: this._buildPayload(values),
        },
      })
    );

    return created.data?.createOneCycle;
  }

  private _buildPayload(values: CycleFormFields) {
    return {
      name: values.name,
      // 'T12:00:00' (mediodía local) evita que `new Date('YYYY-MM-DD')`
      // se interprete como medianoche UTC y recorra un día hacia atrás
      // en zonas horarias negativas.
      start: new Date(`${values.start}T12:00:00`).toISOString(),
      end: new Date(`${values.end}T12:00:00`).toISOString(),
    };
  }
}
