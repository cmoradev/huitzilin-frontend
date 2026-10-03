import { AfterViewInit, Component, inject, signal } from '@angular/core';
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
import {
  PackagePartsFragment,
  CreateOneEnrollmentGQL,
  EnrollmentPartsFragment,
  EnrollmentState,
  UpdateOneEnrollmentGQL,
  LevelPartsFragment,
} from '@graphql';
import {
  FormToolsService,
  GlobalStateService,
  LevelToolsService,
  PackageToolsService,
} from '@services';
import { enrollmentStates } from '@utils/contains';
import { debounceTime, filter, map, startWith } from 'rxjs';

type EnrollmentFormDialogData = EnrollmentPartsFragment | null;

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
    ReactiveFormsModule,
  ],
  templateUrl: './enrollment-form-dialog.component.html',
  styles: ``,
})
export class EnrollmentFormDialogComponent implements AfterViewInit {
  public readonly formTools = inject(FormToolsService);

  public loading = signal(false);
  public data: EnrollmentFormDialogData = inject(MAT_DIALOG_DATA);

  public formGroup = this.formTools.builder.group({
    details: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(128)],
    ],
    state: [EnrollmentState.Active, [Validators.required]],
    package: ['' as any, [Validators.required]],
    level: ['' as any, [Validators.required]],
  });

  private readonly _globalStateService = inject(GlobalStateService);
  private readonly _createOneEnrollment = inject(CreateOneEnrollmentGQL);
  private readonly _updateOneEnrollment = inject(UpdateOneEnrollmentGQL);

  public levelTools = inject(LevelToolsService);
  public packageTools = inject(PackageToolsService);

  public enrollmentStates = enrollmentStates;

  private readonly _dialogRef = inject(
    MatDialogRef<EnrollmentFormDialogComponent>
  );

  ngOnInit(): void {
    if (!!this.data?.id) {
      this.formGroup.patchValue({
        details: this.data.details,
        package: this.data.package,
        state: this.data.state,
        level: this.data.level,
      });
    }

    this.formGroup
      .get('package')!
      .valueChanges.pipe(filter((value) => typeof value === 'object'))
      .subscribe(() => {
        const packageName = this.formGroup.get('package')?.value?.name ?? '';
        this.formGroup.get('details')?.setValue(packageName);
      });
  }

  ngAfterViewInit(): void {
    this.formGroup
      .get('package')
      ?.valueChanges.pipe(
        filter((value) => typeof value === 'string'),
        debounceTime(300),
        startWith('')
      )
      .subscribe({
        next: (value) => this.packageTools.fetch(value),
      });

    this.formGroup
      .get('level')
      ?.valueChanges.pipe(
        filter((value) => typeof value === 'string'),
        debounceTime(300),
        startWith('')
      )
      .subscribe({
        next: (value) => this.levelTools.fetch(value),
      });
  }

  public submit(): void {
    if (this.formGroup.valid) {
      this.loading.set(true);

      const values = this.formGroup.getRawValue() as any;

      if (!!this.data?.id) {
        this._update(values).subscribe({
          next: (branch) => {
            this._dialogRef.close(branch);
          },
          error: (err) => {
            console.error('UPDATE ENROLLMENT ERROR: ', err);
          },
          complete: () => {
            this.loading.set(false);
          },
        });
      } else if (
        this._globalStateService.cycle!.id &&
        this._globalStateService.student!.id &&
        this._globalStateService.branch!.id
      ) {
        this._save(values).subscribe({
          next: (branch) => {
            this._dialogRef.close(branch);
          },
          error: (err) => {
            console.error('CREATE ENROLLMENT ERROR: ', err);
          },
          complete: () => {
            this.loading.set(false);
          },
        });
      }
    }
  }

  private _update(values: FormValues) {
    return this._updateOneEnrollment
      .mutate({
        variables: {
          id: this.data!.id,
          update: {
            details: values.details,
            state: values.state,
            packageId: values.package.id,
            levelId: values.level.id,
            hours: 0,
            diciplines: 0,
            schedules: [],
          },
        },
      })
      .pipe(map((value) => value.data?.updateOneEnrollment));
  }

  private _save(values: FormValues) {
    const cycle = this._globalStateService.cycle!;

    // NOTE: `periodId` es estrictamente requerido por el contrato GraphQL
    // (`CreateEnrollment.periodId: Scalars['String']['input']`). Se omite
    // mediante un cast porque el formulario ya no gestiona periodos; si el
    // backend lo exige no-nulo, esta mutación fallará en runtime hasta que
    // el esquema/codegen se actualice para marcarlo opcional.
    const enrollment = {
      studentId: this._globalStateService.student!.id,
      branchId: this._globalStateService.branch!.id,
      cycleId: cycle.id,
      packageId: values.package.id,
      levelId: values.level.id,
      start: cycle.start,
      end: cycle.end,
      details: values.details,
      state: values.state,
      hours: 0,
      diciplines: 0,
      schedules: [],
      order: 0,
    } as any;

    return this._createOneEnrollment
      .mutate({ variables: { enrollment } })
      .pipe(map((value) => value.data?.createOneEnrollment));
  }
}

type FormValues = {
  details: string;
  state: EnrollmentState;
  package: PackagePartsFragment;
  level: LevelPartsFragment;
};