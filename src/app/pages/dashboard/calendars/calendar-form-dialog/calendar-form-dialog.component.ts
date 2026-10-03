import { Component, computed, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
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
import { FormToolsService, GlobalStateService } from '@services';
import { map, merge } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { startOfMonth, endOfMonth, format, setHours } from 'date-fns';
import { daysOfWeek } from '@utils/contains';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-calendar-form-dialog',
  imports: [
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatTimepickerModule,
  ],
  templateUrl: './calendar-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class CalendarFormDialogComponent implements OnInit {
  public readonly formTools = inject(FormToolsService);

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
  public minHour = computed(() => this._globalStateService.period?.firstHour || '08:00');
  public maxHour = computed(() => this._globalStateService.period?.lastHour || '20:00');

  public formGroup = this.formTools.builder.group({
    name: this.formTools.builder.control<string>(
      format(new Date(), 'MMMM yyyy').toUpperCase(),
      {
        validators: [Validators.required, Validators.maxLength(32)],
        nonNullable: true,
      }
    ),
    days: this.formTools.builder.control<string[]>(['1', '2', '3', '4', '5'], {
      validators: [Validators.required],
      nonNullable: true,
    }),
    start: this.formTools.builder.control<Date>(startOfMonth(new Date()), {
      validators: [Validators.required],
      nonNullable: true,
    }),
    end: this.formTools.builder.control<Date>(endOfMonth(new Date()), {
      validators: [Validators.required],
      nonNullable: true,
    }),
    firstHour: this.formTools.builder.control<Date>(
      new Date(2025, 5, 15, 10, 0),
      {
        validators: [Validators.required],
        nonNullable: true,
      }
    ),
    lastHour: this.formTools.builder.control<Date>(
      new Date(2025, 5, 15, 18, 0),
      {
        validators: [Validators.required],
        nonNullable: true,
      }
    ),
  });

  ngOnInit(): void {
    if (!!this.data?.id) {
      this.formGroup.patchValue({
        name: this.data.name,
        days: this.data.days.split(','),
        start: new Date(`${this.data.start}T12:00:00`),
        end: new Date(`${this.data.end}T12:00:00`),
        firstHour: new Date(`2025-06-15T${this.data.firstHour}`),
        lastHour: new Date(`2025-06-15T${this.data.lastHour}`),
      });
    }

    merge(
      this.formGroup.get('start')!.valueChanges,
      this.formGroup.get('end')!.valueChanges
    ).subscribe({
      next: () => {
        let name = '';

        if (!!this.formGroup.get('start')?.value) {
          const start = this.formGroup.get('start')!.value;
          const startName = format(start, 'MMMM yyyy').toUpperCase();
          name = startName;
        }

        if (!!this.formGroup.get('end')?.value) {
          const end = this.formGroup.get('end')!.value;
          const endName = format(end, 'MMMM yyyy').toUpperCase();
          if (name !== endName) {
            name += ` - ${endName}`;
          }
        }
        this.formGroup.patchValue({ name }, { emitEvent: false });
      },
    });
  }

  public async submit(): Promise<void> {
    if (this.formGroup.valid) {
      const values = this.formGroup.getRawValue();

      this.loading.set(true);

      if (!!this.data?.id) {
        this._update(values).subscribe({
          next: (period) => {
            this._dialogRef.close(period);
            this._snackBar.open('Se ha actualizado correctamente', 'Cerrar', {
              duration: 1000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
          },
          error: (err) => {
            console.error('UPDATE PERIOD ERROR: ', err);
          },
          complete: () => {
            this.loading.set(false);
          },
        });
      } else if (this._globalStateService.branch?.id) {
        this._save(values).subscribe({
          next: (cycle) => {
            this._dialogRef.close(cycle);
            this._snackBar.open('Se ha creado correctamente', 'Cerrar', {
              duration: 1000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
          },
          error: (err) => {
            console.error('CREATE PERIOD ERROR: ', err);
          },
          complete: () => {
            this.loading.set(false);
          },
        });
      }
    }
  }

  private _update(values: FormValues) {
    return this._updateOnePeriod
      .mutate({
        variables: {
          id: this.data!.id,
          update: {
            name: values.name,
            days: values.days.join(','),
            start: values.start.toISOString(),
            end: values.end.toISOString(),
            firstHour: values.firstHour.toTimeString().slice(0, 5),
            lastHour: values.lastHour.toTimeString().slice(0, 5),
          },
        },
      })
      .pipe(map((value) => value.data?.updateOnePeriod));
  }

  private _save(values: FormValues) {
    return this._createOnePeriod
      .mutate({
        variables: {
          period: {
            name: values.name,
            days: values.days.join(','),
            start: values.start.toISOString(),
            end: values.end.toISOString(),
            firstHour: values.firstHour.toTimeString().slice(0, 5),
            lastHour: values.lastHour.toTimeString().slice(0, 5),
            branchId: this._globalStateService.branch!.id,
            order: 0,
          },
        },
      })
      .pipe(map((value) => value.data?.createOnePeriod));
  }
}
type FormValues = {
  name: string;
  days: string[];
  start: Date;
  end: Date;
  firstHour: Date;
  lastHour: Date;
};
