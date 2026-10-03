import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CreateOneDisciplineGQL,
  DisciplinePartsFragment,
  GetLevelsPageGQL,
  GetLevelsPageQueryVariables,
  GetPackagePageGQL,
  GetPackagePageQueryVariables,
  LevelPartsFragment,
  PackagePartsFragment,
  UpdateOneDisciplineGQL,
} from '@graphql';
import { PackageKindPipe } from '@pipes';
import { FormToolsService, GlobalStateService } from '@services';
import { map } from 'rxjs';

@Component({
  selector: 'app-discipline-form-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    PackageKindPipe,
  ],
  templateUrl: './discipline-form-dialog.component.html',
  styles: ``,
})
export class DisciplineFormDialogComponent {
  public readonly formTools = inject(FormToolsService);

  public loading = signal<boolean>(false);
  public data: DisciplinePartsFragment | null = inject(MAT_DIALOG_DATA);

  private readonly _globalStateService = inject(GlobalStateService);
  private readonly _createOneDiscipline = inject(CreateOneDisciplineGQL);
  private readonly _updateOneDiscipline = inject(UpdateOneDisciplineGQL);
  private readonly _getPackagesPage = inject(GetPackagePageGQL);
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _dialogRef = inject(
    MatDialogRef<DisciplineFormDialogComponent>
  );

  public packages = signal<PackagePartsFragment[]>([]);

  public formGroup = this.formTools.builder.group({
    name: this.formTools.builder.control('', {
      validators: [Validators.required, Validators.maxLength(32)],
      nonNullable: true,
    }),
    minHours: this.formTools.builder.control(1, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    packages: this.formTools.builder.control<string[]>([], {
      validators: [],
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    this._fetchAllPackages();

    if (!!this.data?.id) {
      this.formGroup.patchValue({
        name: this.data.name,
        minHours: this.data.minHours,
        packages: this.data.packages.map((pkg) => pkg.id),
      });
    }
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
            console.error('UPDATE CYCLE ERROR: ', err);
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
            console.error('CREATE CYCLE ERROR: ', err);
          },
          complete: () => {
            this.loading.set(false);
          },
        });
      }
    }
  }

  private _update(values: FormValues) {
    return this._updateOneDiscipline
      .mutate({
        variables: {
          id: this.data!.id,
          update: {
            name: values.name,
            minHours: values.minHours,
            packages: values.packages!.map((id) => ({ id })),
          },
        },
      })
      .pipe(map((value) => value.data?.updateOneDiscipline));
  }

  private _save(values: FormValues) {
    return this._createOneDiscipline
      .mutate({
        variables: {
          discipline: {
            name: values.name,
            minHours: values.minHours,
            packages: values.packages!.map((id) => ({ id })),
            branchId: this._globalStateService.branch!.id,
          },
        },
      })
      .pipe(map((value) => value.data?.createOneDiscipline));
  }

  private _fetchAllPackages(accumulared: PackagePartsFragment[] = []): void {
    if (!!this._globalStateService.branch?.id) {
      const limit = 50;
      const offset = accumulared.length;

      const params: GetPackagePageQueryVariables = {
        filter: { branchId: { eq: this._globalStateService.branch!.id } },
        limit,
        offset,
      };

      const getPackages$ = this._getPackagesPage
        .watch({
          variables: params,
          fetchPolicy: 'cache-and-network', // Usa cache primero, solo pide a la API si no hay datos en cache
          nextFetchPolicy: 'cache-and-network', // Mantiene la política de cache en siguientes peticiones
          notifyOnNetworkStatusChange: false, // No notifica cambios de red para evitar refetch innecesario
        })
        .valueChanges;

      getPackages$.pipe(map((resp) => resp.data?.packages)).subscribe({
        next: (packages) => {
          if (!packages) return;

          const nodes = (packages.nodes ?? []) as PackagePartsFragment[];
          const totalCount = packages.totalCount ?? 0;

          const allItems = accumulared.concat(nodes);

          if (allItems.length >= totalCount) {
            this.packages.set(allItems);
            return; // No more fees to fetch
          }

          this._fetchAllPackages(allItems);
        },
        error: (error) => {
          console.error('Error fetching fees', error);
        },
      });
    } else {
      this.packages.set([]);
    }
  }
}

type FormValues = {
  name: string;
  minHours: number;
  packages: string[];
};
