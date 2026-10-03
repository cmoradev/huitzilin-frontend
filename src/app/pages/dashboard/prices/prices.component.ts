import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Component, computed, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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
import { debounceTime, map, merge, tap } from 'rxjs';
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
    ReactiveFormsModule,
    ActivityItemComponent,
    FeeItemComponent,
  ],
  templateUrl: './prices.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class PricesComponent implements OnInit {
  private readonly _dialog = inject(MatDialog);
  private readonly _globalStateService = inject(GlobalStateService);
  private readonly _snackBar = inject(MatSnackBar);

  public activity = computed(() => this._globalStateService.activity);

  private readonly _packagesPageGQL = inject(GetPackagePageGQL);
  private readonly _setOrderActivitiesGQL = inject(SetOrderActivitiesGQL);
  private readonly _feesPageGQL = inject(GetFeePageGQL);

  public activities = signal<PackagePartsFragment[]>([]);
  public activitiesLoading = signal<boolean>(false);
  public activitiesTotalCount = signal<number>(0);

  public fees = signal<FeePartsFragment[]>([]);
  public feesLoading = signal<boolean>(false);
  public feesTotalCount = signal<number>(0);

  public searchControl = new FormControl('');

  ngOnInit(): void {
    merge(this._globalStateService.branch$, this.searchControl.valueChanges)
      .pipe(debounceTime(300))
      .subscribe({
        next: () => {
          this.refreshActivities();
        },
      });

    this._globalStateService.activity$.subscribe({
      next: () => {
        this.refreshFees();
      },
    });
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

  public refreshActivities(accumulared: PackagePartsFragment[] = []): void {
    if (!!this._globalStateService.branch?.id) {
      const limit = 50;
      const offset = accumulared.length;

      const params: GetPackagePageQueryVariables = {
        limit,
        offset,
        filter: {
          branchId: { eq: this._globalStateService.branch!.id },
          name: { iLike: `%${this.searchControl.value}%` },
        },
      };

      this.activitiesLoading.set(true);

      const getActivities$ = this._packagesPageGQL
        .watch({
          variables: params,
          fetchPolicy: 'cache-and-network',
          nextFetchPolicy: 'cache-and-network',
          notifyOnNetworkStatusChange: true,
        })
        .valueChanges;

      getActivities$.pipe(
        tap((resp) => this.activitiesLoading.set(resp.loading)),
        map((resp) => resp.data?.packages)
      ).subscribe({
        next: (packages) => {
          if (!packages) {
            return;
          }

          const { nodes = [], totalCount = 0 } = packages;
          const typedNodes = nodes as PackagePartsFragment[];

          const allItems = accumulared.concat(typedNodes);

          if (allItems.length >= totalCount) {
            this.activities.set(allItems);
            this.activitiesTotalCount.set(totalCount);
            return; // No more activities to fetch
          }

          this.refreshActivities(allItems);
        },
        error: (error) => {
          console.error('Error fetching activities', error);
          this.activitiesLoading.set(false);
        },
      });
    } else {
      this.activities.set([]);
      this.activitiesLoading.set(false);
      this.activitiesTotalCount.set(0);
    }
  }

  public refreshFees(accumulared: FeePartsFragment[] = []): void {
    if (!!this._globalStateService.activity?.id) {
      const limit = 50;
      const offset = accumulared.length;

      const params: GetFeePageQueryVariables = {
        filter: { packageId: { eq: this._globalStateService.activity!.id } },
        limit,
        offset,
      };

      this.feesLoading.set(true);

      const getFees$ = this._feesPageGQL
        .watch({
          variables: params,
          fetchPolicy: 'cache-and-network',
          nextFetchPolicy: 'cache-and-network',
          notifyOnNetworkStatusChange: true,
        })
        .valueChanges;

      getFees$.pipe(
        tap((resp) => this.feesLoading.set(resp.loading)),
        map((resp) => resp.data?.fees)
      ).subscribe({
        next: (fees) => {
          if (!fees) {
            return;
          }

          const { nodes = [], totalCount = 0 } = fees;
          const typedNodes = nodes as FeePartsFragment[];

          const allItems = accumulared.concat(typedNodes);

          if (allItems.length >= totalCount) {
            this.fees.set(allItems);
            this.feesTotalCount.set(totalCount);
            return; // No more fees to fetch
          }

          this.refreshFees(allItems);
        },
        error: (error) => {
          console.error('Error fetching fees', error);
          this.feesLoading.set(false);
        },
      });
    } else {
      this.fees.set([]);
      this.feesLoading.set(false);
      this.feesTotalCount.set(0);
    }
  }

  public dropActivity(event: CdkDragDrop<PackagePartsFragment[]>) {
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
