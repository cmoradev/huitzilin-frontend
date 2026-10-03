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
import {
  PackagePartsFragment,
  CreateOneEnrollmentGQL,
  EnrollmentPartsFragment,
  EnrollmentState,
  UpdateOneEnrollmentGQL,
  LevelPartsFragment,
} from '@graphql';
import {
  GlobalStateService,
  LevelToolsService,
  PackageToolsService,
} from '@services';
import { enrollmentStates } from '@utils/contains';
import { firstValueFrom } from 'rxjs';
import {
  form,
  FormField,
  FormRoot,
  maxLength,
  minLength,
  required,
} from '@angular/forms/signals';
import { EnrollmentFormFields } from '@app/types/enrollments';

@Component({
  selector: 'app-enrollment-form-dialog',
  imports: [
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    FormField,
    FormRoot,
  ],
  templateUrl: './enrollment-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class EnrollmentFormDialogComponent implements OnInit {
  public loading = signal(false);
  public data: EnrollmentPartsFragment | null = inject(MAT_DIALOG_DATA);

  public readonly isEditing = computed(() => !!this.data?.id);

  private readonly _initialModel = computed<EnrollmentFormFields>(() => ({
    details: this.data?.details ?? '',
    state: (this.data?.state ?? EnrollmentState.Active) as EnrollmentState,
    package: this.data?.package?.id ?? null,
    level: this.data?.level?.id ?? null,
  }));

  public readonly enrollmentModel = linkedSignal<
    EnrollmentFormFields,
    EnrollmentFormFields
  >({
    source: this._initialModel,
    computation: (initial) => ({ ...initial }),
  });

  public readonly enrollmentForm = form(this.enrollmentModel, (schema) => {
    required(schema.details, { message: 'Campo requerido' });
    minLength(schema.details, 3, { message: 'Mínimo 3 caracteres' });
    maxLength(schema.details, 128, { message: 'Máximo 128 caracteres' });
    required(schema.state, { message: 'Seleccione un estado' });
    required(schema.package, { message: 'Seleccione un paquete' });
    required(schema.level, { message: 'Seleccione un nivel' });
  });

  public readonly packageSearchTerm = signal('');
  public readonly levelSearchTerm = signal('');

  private readonly _globalStateService = inject(GlobalStateService);
  private readonly _createOneEnrollment = inject(CreateOneEnrollmentGQL);
  private readonly _updateOneEnrollment = inject(UpdateOneEnrollmentGQL);

  public levelTools = inject(LevelToolsService);
  public packageTools = inject(PackageToolsService);

  public enrollmentStates = enrollmentStates;

  private readonly _dialogRef = inject(
    MatDialogRef<EnrollmentFormDialogComponent>
  );

  constructor() {
    effect(() => {
      this._dialogRef.disableClose = this.loading();
    });
  }

  ngOnInit(): void {
    this.levelTools.fetchAll();
    this.packageTools.fetchAll();
  }

  public onPackageSelected(pkg: PackagePartsFragment): void {
    this.enrollmentModel.update((m) => ({
      ...m,
      package: pkg.id,
      details: m.details || pkg.name,
    }));
    this.packageSearchTerm.set(pkg.name);
    this.enrollmentForm.package().value.set(pkg.id);
  }

  public onLevelSelected(level: LevelPartsFragment): void {
    this.enrollmentModel.update((m) => ({
      ...m,
      level: level.id,
    }));
    this.levelSearchTerm.set(level.name);
    this.enrollmentForm.level().value.set(level.id);
  }

  public clearPackage(): void {
    this.enrollmentModel.update((m) => ({ ...m, package: null }));
    this.enrollmentForm.package().value.set(null);
    this.packageSearchTerm.set('');
  }

  public clearLevel(): void {
    this.enrollmentModel.update((m) => ({ ...m, level: null }));
    this.enrollmentForm.level().value.set(null);
    this.levelSearchTerm.set('');
  }

  public onPackageSearch(value: string): void {
    this.packageSearchTerm.set(value);
    this.packageTools.fetch(value);
  }

  public onLevelSearch(value: string): void {
    this.levelSearchTerm.set(value);
    this.levelTools.fetch(value);
  }

  public async submit(): Promise<void> {
    if (this.enrollmentForm().invalid()) {
      return;
    }

    const values = this.enrollmentModel();
    this.loading.set(true);

    try {
      const enrollment = this.isEditing()
        ? await this._update(values)
        : await this._save(values);

      this._dialogRef.close(enrollment);
    } catch (err) {
      console.error(
        this.isEditing()
          ? 'UPDATE ENROLLMENT ERROR: '
          : 'CREATE ENROLLMENT ERROR: ',
        err
      );
    } finally {
      this.loading.set(false);
    }
  }

  private async _update(values: EnrollmentFormFields) {
    const updated = await firstValueFrom(
      this._updateOneEnrollment.mutate({
        variables: {
          id: this.data!.id,
          update: {
            details: values.details,
            state: values.state,
            packageId: values.package!,
            levelId: values.level!,
            hours: 0,
            diciplines: 0,
            schedules: [],
          },
        },
      })
    );

    return updated.data?.updateOneEnrollment;
  }

  private async _save(values: EnrollmentFormFields) {
    const cycle = this._globalStateService.cycle!;

    const created = await firstValueFrom(
      this._createOneEnrollment.mutate({
        variables: {
          enrollment: {
            studentId: this._globalStateService.student!.id,
            branchId: this._globalStateService.branch!.id,
            cycleId: cycle.id,
            periodId: this._globalStateService.period!.id,
            packageId: values.package!,
            levelId: values.level!,
            start: cycle.start,
            end: cycle.end,
            details: values.details,
            state: values.state,
            hours: 0,
            diciplines: 0,
            schedules: [],
            order: 0,
          },
        },
      })
    );

    return created.data?.createOneEnrollment;
  }
}