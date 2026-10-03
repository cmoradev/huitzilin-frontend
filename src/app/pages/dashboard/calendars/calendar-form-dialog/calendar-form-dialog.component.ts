import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CreateOnePeriodGQL,
  UpdateOnePeriodGQL,
  PeriodPartsFragment,
} from '@graphql';
import { GlobalStateService } from '@services';
import { firstValueFrom, map } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  endOfMonth,
  format,
  startOfMonth,
} from 'date-fns';
import { daysOfWeek } from '@utils/contains';
import { MatSelectModule } from '@angular/material/select';
import {
  form,
  FormField,
  FormRoot,
  maxLength,
  required,
  validateTree,
} from '@angular/forms/signals';
import { PeriodFormFields } from '@app/types/periods';

const formatMonthYear = (date: Date): string =>
  format(date, 'MMMM yyyy').toUpperCase();

@Component({
  selector: 'app-calendar-form-dialog',
  imports: [
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatTimepickerModule,
    FormField,
    FormRoot,
  ],
  templateUrl: './calendar-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class CalendarFormDialogComponent {
  public loading = signal<boolean>(false);
  public data: PeriodPartsFragment | null = inject(MAT_DIALOG_DATA);

  private readonly _globalStateService = inject(GlobalStateService);
  private readonly _createOnePeriod = inject(CreateOnePeriodGQL);
  private readonly _updateOnePeriod = inject(UpdateOnePeriodGQL);
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _dialogRef = inject(
    MatDialogRef<CalendarFormDialogComponent>
  );

  public days = daysOfWeek;
  public minHour = computed(
    () => this._globalStateService.period?.firstHour || '08:00'
  );
  public maxHour = computed(
    () => this._globalStateService.period?.lastHour || '20:00'
  );

  public readonly isEditing = computed(() => !!this.data?.id);

  private readonly _initialModel = computed<PeriodFormFields>(() => ({
    name: this.data?.name ?? formatMonthYear(new Date()),
    days: this.data?.days.split(',') ?? ['1', '2', '3', '4', '5'],
    start: this.data?.start ?? startOfMonth(new Date()).toISOString(),
    end: this.data?.end ?? endOfMonth(new Date()).toISOString(),
    firstHour: this.data?.firstHour ?? '10:00',
    lastHour: this.data?.lastHour ?? '18:00',
  }));

  public readonly periodModel = linkedSignal<PeriodFormFields, PeriodFormFields>({
    source: this._initialModel,
    computation: (initial) => ({ ...initial }),
  });

  public readonly periodForm = form(this.periodModel, (schema) => {
    required(schema.name, { message: 'Campo requerido' });
    maxLength(schema.name, 32, { message: 'Máximo 32 caracteres' });
    required(schema.days, { message: 'Seleccione al menos un día' });
    required(schema.start, { message: 'Seleccione una fecha de inicio' });
    required(schema.end, { message: 'Seleccione una fecha de fin' });
    required(schema.firstHour, { message: 'Seleccione la hora de inicio' });
    required(schema.lastHour, { message: 'Seleccione la hora de cierre' });

    validateTree(schema, ({ valueOf }) => {
      const start = valueOf(schema.start);
      const end = valueOf(schema.end);
      if (start && end && new Date(start) >= new Date(end)) {
        return {
          kind: 'endDateInvalid',
          message:
            'La fecha de finalización debe ser mayor a la fecha de inicio',
          fieldTree: this.periodForm.end,
        };
      }
      return null;
    });
  });

  private readonly _nameEdited = signal(false);

  constructor() {
    effect(() => {
      const start = this.periodModel().start;
      const end = this.periodModel().end;

      if (!this._nameEdited() && start && end) {
        const startName = formatMonthYear(new Date(start));
        const endName = formatMonthYear(new Date(end));
        const composed = startName === endName ? startName : `${startName} - ${endName}`;

        this.periodModel.update((m) => ({ ...m, name: composed }));
      }
    });

    effect(() => {
      this._dialogRef.disableClose = this.loading();
    });
  }

  public onNameInput(value: string): void {
    this._nameEdited.set(true);
    this.periodForm.name().value.set(value);
  }

  public async submit(): Promise<void> {
    if (this.periodForm().invalid()) {
      return;
    }

    const values = this.periodModel();
    this.loading.set(true);

    try {
      if (this.isEditing()) {
        const updated = await firstValueFrom(
          this._updateOnePeriod.mutate({
            variables: {
              id: this.data!.id,
              update: this._buildPayload(values),
            },
          })
        );

        this._dialogRef.close(updated.data?.updateOnePeriod);
        this._snackBar.open('Se ha actualizado correctamente', 'Cerrar', {
          duration: 1000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      } else if (this._globalStateService.branch?.id) {
        const created = await firstValueFrom(
          this._createOnePeriod.mutate({
            variables: {
              period: {
                ...this._buildPayload(values),
                branchId: this._globalStateService.branch!.id,
                order: 0,
              },
            },
          })
        );

        this._dialogRef.close(created.data?.createOnePeriod);
        this._snackBar.open('Se ha creado correctamente', 'Cerrar', {
          duration: 1000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
    } catch (err) {
      console.error(
        this.isEditing() ? 'UPDATE PERIOD ERROR: ' : 'CREATE PERIOD ERROR: ',
        err
      );
    } finally {
      this.loading.set(false);
    }
  }

  private _buildPayload(values: PeriodFormFields) {
    return {
      name: values.name,
      days: values.days.join(','),
      start: new Date(values.start).toISOString(),
      end: new Date(values.end).toISOString(),
      firstHour: values.firstHour,
      lastHour: values.lastHour,
    };
  }
}