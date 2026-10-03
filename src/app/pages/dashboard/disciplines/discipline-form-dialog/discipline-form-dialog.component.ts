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
  GetPackagePageGQL,
  GetPackagePageQueryVariables,
  LevelPartsFragment,
  PackagePartsFragment,
  UpdateOneDisciplineGQL,
} from '@graphql';
import { PackageKindPipe } from '@pipes';
import { GlobalStateService } from '@services';
import {
  form,
  FormField,
  FormRoot,
  maxLength,
  min,
  required,
} from '@angular/forms/signals';
import { firstValueFrom, map } from 'rxjs';
import { DisciplineFormFields } from '@app/types/disciplines';

@Component({
  selector: 'app-discipline-form-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    FormField,
    FormRoot,
    PackageKindPipe,
  ],
  templateUrl: './discipline-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class DisciplineFormDialogComponent implements OnInit {
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

  public readonly isEditing = computed(() => !!this.data?.id);

  private readonly _initialModel = computed<DisciplineFormFields>(() => ({
    name: this.data?.name ?? '',
    minHours: this.data?.minHours ?? 1,
    packages: this.data?.packages.map((pkg) => pkg.id) ?? [],
  }));

  public readonly disciplineModel = linkedSignal<
    DisciplineFormFields,
    DisciplineFormFields
  >({
    source: this._initialModel,
    computation: (initial) => ({ ...initial }),
  });

  public readonly disciplineForm = form(this.disciplineModel, (schema) => {
    required(schema.name, { message: 'Campo requerido' });
    maxLength(schema.name, 32, { message: 'Máximo 32 caracteres' });
    required(schema.minHours, { message: 'Campo requerido' });
    min(schema.minHours, 1, { message: 'Mínimo 1 hora' });
    required(schema.packages, { message: 'Seleccione al menos un paquete' });
  });

  constructor() {
    effect(() => {
      this._dialogRef.disableClose = this.loading();
    });
  }

  ngOnInit(): void {
    this._fetchAllPackages();
  }

  public async submit(): Promise<void> {
    if (this.disciplineForm().invalid()) {
      return;
    }

    const values = this.disciplineModel();
    this.loading.set(true);

    try {
      if (this.isEditing()) {
        const updated = await firstValueFrom(
          this._updateOneDiscipline.mutate({
            variables: {
              id: this.data!.id,
              update: {
                name: values.name,
                minHours: values.minHours,
                packages: values.packages.map((id) => ({ id })),
              },
            },
          })
        );

        this._dialogRef.close(updated.data?.updateOneDiscipline);
        this._snackBar.open('Se ha actualizado correctamente', 'Cerrar', {
          duration: 1000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      } else if (this._globalStateService.branch?.id) {
        const created = await firstValueFrom(
          this._createOneDiscipline.mutate({
            variables: {
              discipline: {
                name: values.name,
                minHours: values.minHours,
                packages: values.packages.map((id) => ({ id })),
                branchId: this._globalStateService.branch!.id,
              },
            },
          })
        );

        this._dialogRef.close(created.data?.createOneDiscipline);
        this._snackBar.open('Se ha creado correctamente', 'Cerrar', {
          duration: 1000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
    } catch (err) {
      console.error(
        this.isEditing() ? 'UPDATE DISCIPLINE ERROR: ' : 'CREATE DISCIPLINE ERROR: ',
        err
      );
    } finally {
      this.loading.set(false);
    }
  }

  private _fetchAllPackages(
    accumulated: PackagePartsFragment[] = []
  ): void {
    const branch = this._globalStateService.branch;
    if (!branch?.id) {
      return;
    }

    const limit = 50;
    const offset = accumulated.length;

    const params: GetPackagePageQueryVariables = {
      filter: { branchId: { eq: branch.id } },
      limit,
      offset,
    };

    const getPackages$ = this._getPackagesPage
      .watch({
        variables: params,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: false,
      })
      .valueChanges;

    getPackages$.pipe(map((resp) => resp.data?.packages)).subscribe({
      next: (packages) => {
        if (!packages) return;

        const nodes = (packages.nodes ?? []) as PackagePartsFragment[];
        const totalCount = packages.totalCount ?? 0;

        const allItems = accumulated.concat(nodes);

        if (allItems.length >= totalCount) {
          this.packages.set(allItems);
          return;
        }

        this._fetchAllPackages(allItems);
      },
      error: (error) => {
        console.error('Error fetching packages', error);
      },
    });
  }
}