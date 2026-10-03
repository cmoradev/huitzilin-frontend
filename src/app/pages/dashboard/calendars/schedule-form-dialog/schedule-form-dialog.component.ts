import { NgClass } from '@angular/common';
import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTimepickerModule } from '@angular/material/timepicker';
import {
  CreateOneScheduleGQL,
  DeleteOneScheduleGQL,
  DisciplinePartsFragment,
  SchedulePartsFragment,
  TeacherPartsFragment,
  UpdateOneScheduleGQL,
} from '@graphql';
import {
  DisciplineToolsService,
  FormToolsService,
  GlobalStateService,
  LevelToolsService,
  TeacherToolsService,
} from '@services';
import { daysOfWeek } from '@utils/contains';
import { isUUID } from '@utils/helpers';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-schedule-form-dialog',
  imports: [
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTimepickerModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    NgClass,
  ],
  templateUrl: './schedule-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class ScheduleFormDialogComponent {
  public readonly formTools = inject(FormToolsService);

  public loading = signal<boolean>(false);
  public removeLoading = signal<boolean>(false);
  public data: SchedulePartsFragment | null = inject(MAT_DIALOG_DATA);

  public days = daysOfWeek;

  private readonly _globalStateService = inject(GlobalStateService);
  private readonly _createOneSchedule = inject(CreateOneScheduleGQL);
  private readonly _updateOneSchedule = inject(UpdateOneScheduleGQL);
  private readonly _deleteOneSchedule = inject(DeleteOneScheduleGQL);

  private readonly _snackBar = inject(MatSnackBar);
  private readonly _dialogRef = inject(
    MatDialogRef<ScheduleFormDialogComponent>
  );

  public levelTools = inject(LevelToolsService);
  public disciplineTools = inject(DisciplineToolsService);
  public teacherTools = inject(TeacherToolsService);

  public formGroup = this.formTools.builder.group({
    day: this.formTools.builder.control<string>('', {
      validators: [Validators.required, Validators.maxLength(32)],
      nonNullable: true,
    }),
    start: this.formTools.builder.control<Date>(new Date(2025, 5, 15, 8, 0), {
      validators: [Validators.required],
      nonNullable: true,
    }),
    end: this.formTools.builder.control<Date>(new Date(2025, 5, 15, 20, 0), {
      validators: [Validators.required],
      nonNullable: true,
    }),
    levels: this.formTools.builder.control<string[]>([], {
      validators: [],
      nonNullable: true,
    }),
    teacher: this.formTools.builder.control<TeacherPartsFragment | null>(null, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    discipline: this.formTools.builder.control<DisciplinePartsFragment | null>(
      null,
      {
        validators: [Validators.required],
        nonNullable: true,
      }
    ),
  });

  ngOnInit(): void {
    this.levelTools.fetchAll();
    this.disciplineTools.fetchAll();
    this.teacherTools.fetchAll();

    if (!!this.data?.day)
      this.formGroup.patchValue({ day: this.data.day.toFixed() });
    if (!!this.data?.start)
      this.formGroup.patchValue({ start: new Date(this.data.start) });
    if (!!this.data?.end)
      this.formGroup.patchValue({ end: new Date(this.data.end) });

    if (!!this.data?.id) {
      this.formGroup.patchValue({
        discipline: this.data.discipline as any,
        teacher: this.data.teacher as any,
        levels: this.data.levels!.map((level) => level.id),
      });
    }

    this.formGroup
      .get('discipline')
      ?.valueChanges.pipe(
        filter((value) => typeof value === 'string'),
        filter((value) => !isUUID(value))
      )
      .subscribe({
        next: (value) => this.disciplineTools.fetch(value),
      });
  }

  public async submit(): Promise<void> {
    if (this.formGroup.valid) {
      this.loading.set(true);

      const values = this.formGroup.getRawValue();

      if (!!this.data?.id) {
        this._update(values).subscribe({
          next: (cycle) => {
            this._dialogRef.close(cycle);
            this._snackBar.open('Se ha actualizado correctamente', 'Cerrar', {
              duration: 1000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
          },
          error: (err) => {
            console.error('UPDATE SCHEDULE ERROR: ', err);
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
            console.error('CREATE SCHEDULE ERROR: ', err);
          },
          complete: () => {
            this.loading.set(false);
          },
        });
      }
    }
  }

  public remove() {
    if (!!this.data?.id) {
      this.removeLoading.set(true);

      this._deleteOneSchedule
        .mutate({
          variables: { id: this.data!.id },
        })
        .subscribe({
          next: () => {
            this._snackBar.open('Se ha eliminado correctamente', 'Cerrar', {
              duration: 1000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            this._dialogRef.close(true);
          },
          error: (err) => {
            console.error('DELETE SCHEDULE ERROR: ', err);
          },
          complete: () => {
            this.removeLoading.set(false);
          },
        });
    }
  }

  private _update(values: FormValues) {
    return this._updateOneSchedule
      .mutate({
        variables: {
          id: this.data!.id,
          update: {
            day: parseInt(values.day, 10),
            start: values.start.toTimeString().slice(0, 5),
            end: values.end.toTimeString().slice(0, 5),
            levels: values.levels!.map((id) => ({ id })),
            disciplineId: values.discipline!.id,
            teacherId: values.teacher!.id,
          },
        },
      })
      .pipe(map((value) => value.data?.updateOneSchedule));
  }

  private _save(values: FormValues) {
    return this._createOneSchedule
      .mutate({
        variables: {
          schedule: {
            day: parseInt(values.day, 10),
            start: values.start.toTimeString().slice(0, 5),
            end: values.end.toTimeString().slice(0, 5),
            disciplineId: values.discipline!.id,
            teacherId: values.teacher!.id,
            periodId: this._globalStateService.period!.id,
            branchId: this._globalStateService.branch!.id,
            levels: values.levels!.map((id) => ({ id })),
          },
        },
      })
      .pipe(map((value) => value.data?.createOneSchedule));
  }
}

type FormValues = {
  day: string;
  start: Date;
  end: Date;
  discipline: DisciplinePartsFragment | null;
  teacher: TeacherPartsFragment | null;
  levels: string[];
};
