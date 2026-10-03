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
  GlobalStateService,
  LevelToolsService,
  TeacherToolsService,
} from '@services';
import { daysOfWeek } from '@utils/contains';
import { isUUID } from '@utils/helpers';
import { firstValueFrom } from 'rxjs';
import {
  form,
  FormField,
  FormRoot,
  maxLength,
  required,
} from '@angular/forms/signals';

interface ScheduleFormFields {
  day: string;
  start: string;
  end: string;
  levels: string[];
  teacher: TeacherPartsFragment | null;
  discipline: DisciplinePartsFragment | null;
}

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
    FormField,
    FormRoot,
    MatAutocompleteModule,
  ],
  templateUrl: './schedule-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class ScheduleFormDialogComponent implements OnInit {
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

  public readonly isEditing = computed(() => !!this.data?.id);

  private readonly _initialModel = computed<ScheduleFormFields>(() => ({
    day: this.data?.day?.toString() ?? '',
    start: this.data?.start
      ? new Date(this.data.start).toTimeString().slice(0, 5)
      : '08:00',
    end: this.data?.end
      ? new Date(this.data.end).toTimeString().slice(0, 5)
      : '20:00',
    levels: this.data?.levels?.map((level) => level.id) ?? [],
    teacher: (this.data?.teacher ?? null) as TeacherPartsFragment | null,
    discipline: (this.data?.discipline ?? null) as DisciplinePartsFragment | null,
  }));

  public readonly scheduleModel = linkedSignal<
    ScheduleFormFields,
    ScheduleFormFields
  >({
    source: this._initialModel,
    computation: (initial) => ({ ...initial }),
  });

  public readonly scheduleForm = form(this.scheduleModel, (schema) => {
    required(schema.day, { message: 'Campo requerido' });
    maxLength(schema.day, 32, { message: 'Máximo 32 caracteres' });
    required(schema.start, { message: 'Seleccione una hora' });
    required(schema.end, { message: 'Seleccione una hora' });
    required(schema.teacher, { message: 'Seleccione un docente' });
    required(schema.discipline, { message: 'Seleccione una disciplina' });
    required(schema.levels, { message: 'Seleccione al menos un nivel' });
  });

  // Mantiene sincronizado el término de búsqueda libre para la disciplina.
  private readonly _disciplineSearchTerm = signal('');

  constructor() {
    effect(() => {
      this._dialogRef.disableClose = this.loading();
    });

    effect(() => {
      const term = this._disciplineSearchTerm();
      if (term && !isUUID(term)) {
        this.disciplineTools.fetch(term);
      }
    });
  }

  ngOnInit(): void {
    this.levelTools.fetchAll();
    this.disciplineTools.fetchAll();
    this.teacherTools.fetchAll();
  }

  public onDisciplineInput(value: string): void {
    this._disciplineSearchTerm.set(value);
  }

  public onDisciplineSelected(discipline: DisciplinePartsFragment): void {
    this.scheduleModel.update((m) => ({ ...m, discipline }));
    this.scheduleForm.discipline().value.set(discipline);
    this._disciplineSearchTerm.set('');
  }

  public clearDiscipline(): void {
    this.scheduleModel.update((m) => ({ ...m, discipline: null }));
    this.scheduleForm.discipline().value.set(null);
    this._disciplineSearchTerm.set('');
  }

  public onTeacherSelected(teacher: TeacherPartsFragment): void {
    this.scheduleModel.update((m) => ({ ...m, teacher }));
    this.scheduleForm.teacher().value.set(teacher);
  }

  public clearTeacher(): void {
    this.scheduleModel.update((m) => ({ ...m, teacher: null }));
    this.scheduleForm.teacher().value.set(null);
  }

  public displayTeacher(value: TeacherPartsFragment | null): string {
    return value?.fullname ?? '';
  }

  public displayDiscipline(value: DisciplinePartsFragment | null): string {
    return value?.name ?? '';
  }

  public async submit(): Promise<void> {
    if (this.scheduleForm().invalid()) {
      return;
    }

    const values = this.scheduleModel();
    this.loading.set(true);

    try {
      if (this.isEditing()) {
        const updated = await firstValueFrom(
          this._updateOneSchedule.mutate({
            variables: {
              id: this.data!.id,
              update: this._buildPayload(values),
            },
          })
        );

        this._dialogRef.close(updated.data?.updateOneSchedule);
        this._snackBar.open('Se ha actualizado correctamente', 'Cerrar', {
          duration: 1000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      } else if (this._globalStateService.branch?.id) {
        const created = await firstValueFrom(
          this._createOneSchedule.mutate({
            variables: {
              schedule: {
                ...this._buildPayload(values),
                periodId: this._globalStateService.period!.id,
                branchId: this._globalStateService.branch!.id,
              },
            },
          })
        );

        this._dialogRef.close(created.data?.createOneSchedule);
        this._snackBar.open('Se ha creado correctamente', 'Cerrar', {
          duration: 1000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
    } catch (err) {
      console.error(
        this.isEditing() ? 'UPDATE SCHEDULE ERROR: ' : 'CREATE SCHEDULE ERROR: ',
        err
      );
    } finally {
      this.loading.set(false);
    }
  }

  public remove(): void {
    if (!this.data?.id) {
      return;
    }

    this.removeLoading.set(true);

    this._deleteOneSchedule
      .mutate({
        variables: { id: this.data.id },
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

  private _buildPayload(values: ScheduleFormFields) {
    return {
      day: parseInt(values.day, 10),
      start: values.start,
      end: values.end,
      levels: values.levels.map((id) => ({ id })),
      disciplineId: values.discipline!.id,
      teacherId: values.teacher!.id,
    };
  }
}