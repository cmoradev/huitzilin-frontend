import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDivider, MatListModule } from '@angular/material/list';
import {
  PackagePartsFragment,
  FeePartsFragment,
  GetPackagePageGQL,
  GetPackagePageQueryVariables,
  GetFeePageGQL,
  GetFeePageQueryVariables,
  SetOrderActivitiesGQL,
  SetOrderInput,
} from '@graphql';
import { GlobalStateService } from '@services';
import { NgScrollbar } from 'ngx-scrollbar';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { ActivityDeleteDialogComponent } from './activity-delete-dialog/activity-delete-dialog.component';
import { ActivityFormDialogComponent } from './activity-form-dialog/activity-form-dialog.component';
import { ActivityItemComponent } from './activity-item/activity-item.component';
import { FeeDeleteDialogComponent } from './fee-delete-dialog/fee-delete-dialog.component';
import { FeeFormDialogComponent } from './fee-form-dialog/fee-form-dialog.component';
import { FeeItemComponent } from './fee-item/fee-item.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-prices',
  imports: [
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatListModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatDivider,
    NgScrollbar,
    MatButtonModule,
    MatInputModule,
    DragDropModule,
    ActivityItemComponent,
    FeeItemComponent,
  ],
  templateUrl: './prices.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class PricesComponent {
  private readonly _dialog = inject(MatDialog);
  private readonly _globalStateService = inject(GlobalStateService);
  private readonly _snackBar = inject(MatSnackBar);

  public readonly activity = computed(() => this._globalStateService.activity);

  private readonly _packagesPageGQL = inject(GetPackagePageGQL);
  private readonly _setOrderActivitiesGQL = inject(SetOrderActivitiesGQL);
  private readonly _feesPageGQL = inject(GetFeePageGQL);

  public activities = signal<PackagePartsFragment[]>([]);
  public activitiesLoading = signal<boolean>(false);
  public activitiesTotalCount = signal<number>(0);

  public fees = signal<FeePartsFragment[]>([]);
  public feesLoading = signal<boolean>(false);
  public feesTotalCount = signal<number>(0);

  public readonly searchTerm = signal('');

  private readonly _debouncedSearchTerm = signal('');

  public readonly refreshTrigger = signal(0);

  constructor() {
    toObservable(this.searchTerm)
      .pipe(debounceTime(300))
      .subscribe((term) => this._debouncedSearchTerm.set(term));

    // Reacciona a la rama y al término de búsqueda para refrescar actividades.
    effect(() => {
      const branch = this._globalStateService.branch;
      const term = this._debouncedSearchTerm();
      this.refreshTrigger();

      if (!branch?.id) {
        this.activities.set([]);
        this.activitiesLoading.set(false);
        this.activitiesTotalCount.set(0);
        return;
      }

      this.activitiesLoading.set(true);
      this._fetchActivities(branch.id, term, []);
    });

    // Reacciona a la actividad seleccionada para refrescar las tarifas.
    effect(() => {
      const activity = this.activity();

      if (!activity?.id) {
        this.fees.set([]);
        this.feesLoading.set(false);
        this.feesTotalCount.set(0);
        return;
      }

      this.feesLoading.set(true);
      this._fetchFees(activity.id, []);
    });
  }

  private _fetchActivities(
    branchId: string,
    term: string,
    accumulated: PackagePartsFragment[]
  ): void {
    const limit = 50;
    const offset = accumulated.length;

    const params: GetPackagePageQueryVariables = {
      limit,
      offset,
      filter: {
        branchId: { eq: branchId },
        name: { iLike: `%${term}%` },
      },
    };

    this._packagesPageGQL
      .watch({
        variables: params,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      })
      .valueChanges.subscribe({
        next: ({ data, loading }) => {
          this.activitiesLoading.set(loading);
          const packages = data?.packages;
          if (!packages) {
            return;
          }

          const nodes = (packages.nodes ?? []) as PackagePartsFragment[];
          const totalCount = packages.totalCount ?? 0;
          const allItems = accumulated.concat(nodes);

          if (allItems.length >= totalCount) {
            this.activities.set(allItems);
            this.activitiesTotalCount.set(totalCount);
            return;
          }

          this._fetchActivities(branchId, term, allItems);
        },
        error: (error) => {
          console.error('Error fetching activities', error);
          this.activitiesLoading.set(false);
        },
      });
  }

  private _fetchFees(
    activityId: string,
    accumulated: FeePartsFragment[]
  ): void {
    const limit = 50;
    const offset = accumulated.length;

    const params: GetFeePageQueryVariables = {
      filter: { packageId: { eq: activityId } },
      limit,
      offset,
    };

    this._feesPageGQL
      .watch({
        variables: params,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      })
      .valueChanges.subscribe({
        next: ({ data, loading }) => {
          this.feesLoading.set(loading);
          const fees = data?.fees;
          if (!fees) {
            return;
          }

          const nodes = (fees.nodes ?? []) as FeePartsFragment[];
          const totalCount = fees.totalCount ?? 0;
          const allItems = accumulated.concat(nodes);

          if (allItems.length >= totalCount) {
            this.fees.set(allItems);
            this.feesTotalCount.set(totalCount);
            return;
          }

          this._fetchFees(activityId, allItems);
        },
        error: (error) => {
          console.error('Error fetching fees', error);
          this.feesLoading.set(false);
        },
      });
  }

  public onSearchInput(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  public openActivityFormDialog(
    value: PackagePartsFragment | undefined = undefined
  ): void {
    const $dialog = this._dialog.open(ActivityFormDialogComponent, {
      width: '32rem',
      data: value,
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (activity) => {
        if (activity) this.refreshActivities();
      },
    });
  }

  public openActivityDeleteDialog(value: PackagePartsFragment): void {
    const $dialog = this._dialog.open(ActivityDeleteDialogComponent, {
      width: '32rem',
      data: value,
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (activity) => {
        if (activity) this.refreshActivities();
      },
    });
  }

  public openFeeFormDialog(
    value: FeePartsFragment | undefined = undefined
  ): void {
    const $dialog = this._dialog.open(FeeFormDialogComponent, {
      width: '32rem',
      data: value,
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (fee) => {
        if (fee) this.refreshFees();
      },
    });
  }

  public openFeeDeleteDialog(value: FeePartsFragment): void {
    const $dialog = this._dialog.open(FeeDeleteDialogComponent, {
      width: '32rem',
      data: value,
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (fee) => {
        if (fee) this.refreshFees();
      },
    });
  }

  public refreshActivities(): void {
    this.refreshTrigger.update((v) => v + 1);
  }

  public refreshFees(): void {
    this.refreshTrigger.update((v) => v + 1);
  }

  public dropActivity(event: CdkDragDrop<PackagePartsFragment[]>): void {
    this.activities.update((previous) => {
      const values = [...previous];
      moveItemInArray(values, event.previousIndex, event.currentIndex);
      return values;
    });

    this.updateOrderActivities();
  }

  private updateOrderActivities(): void {
    const payload: SetOrderInput[] = this.activities().map((item, index) => ({
      id: item.id,
      order: index + 1,
    }));

    this._setOrderActivitiesGQL.mutate({ variables: { payload } }).subscribe({
      next: () => {
        this._snackBar.open(
          'Se ha actualizado el orden correctamente',
          'Cerrar',
          {
            duration: 1000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          }
        );
      },
      error: (error) => {
        console.error('Error updating order activities', error);
      },
    });
  }
}