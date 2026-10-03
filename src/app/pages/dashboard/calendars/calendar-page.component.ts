import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  GetPeriodsPageGQL,
  GetPeriodsPageQueryVariables,
  GetSchedulesPageGQL,
  GetSchedulesPageQueryVariables,
  PeriodPartsFragment,
  SchedulePartsFragment,
  SetOrderInput,
  SetOrderPeriodsGQL,
} from '@graphql';
import { GlobalStateService } from '@services';
import { NgScrollbar } from 'ngx-scrollbar';
import { debounceTime, map, merge, tap } from 'rxjs';
import { CalendarFormDialogComponent } from './calendar-form-dialog/calendar-form-dialog.component';
import { CalendarDeleteDialogComponent } from './calendar-delete-dialog/calendar-delete-dialog.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PeriodItemComponent } from './period-item/period-item.component';
import { RouterLink } from '@angular/router';
import {
  CalendarComponent,
  CalendarSlot,
} from '@components/calendar/calendar.component';
import { ScheduleFormDialogComponent } from './schedule-form-dialog/schedule-form-dialog.component';
import { addHours } from 'date-fns';
import { defaultDate } from '@utils/contains';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-calendar-page',
  imports: [
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatTooltipModule,
    DragDropModule,
    MatProgressBarModule,
    MatChipsModule,
    PeriodItemComponent,
    CalendarComponent,
    NgScrollbar,
  ],
  templateUrl: './calendar-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class CalendarPageComponent {
  private readonly _dialog = inject(MatDialog);
  private readonly _globalStateService = inject(GlobalStateService);
  private readonly _snackBar = inject(MatSnackBar);

  public period = computed(() => this._globalStateService.period);

  private readonly _periodsPageGQL = inject(GetPeriodsPageGQL);
  private readonly _setOrderPeriodsGQL = inject(SetOrderPeriodsGQL);
  private readonly _schedulesPageGQL = inject(GetSchedulesPageGQL);

  public periods = signal<PeriodPartsFragment[]>([]);
  public periodsLoading = signal<boolean>(false);
  public periodsTotalCount = signal<number>(0);

  public schedules = signal<SchedulePartsFragment[]>([]);
  public schedulesLoading = signal<boolean>(false);
  public schedulesTotalCount = signal<number>(0);

  public searchControl = new FormControl('');

  ngOnInit(): void {
    merge(this._globalStateService.branch$, this.searchControl.valueChanges)
      .pipe(debounceTime(300))
      .subscribe({
        next: () => {
          this.refreshPeriods();
        },
      });

    this._globalStateService.period$.subscribe({
      next: () => {
        this.refreshSchedules();
      },
    });
  }

  public openPeriodFormDialog(
    value: PeriodPartsFragment | undefined = undefined
  ): void {
    const $dialog = this._dialog.open(CalendarFormDialogComponent, {
      width: '32rem',
      data: value,
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (period) => {
        if (period) {
          this._globalStateService.period = period;
          this.refreshPeriods();
        }
      },
    });
  }

  public openPeriodDeleteDialog(value: PeriodPartsFragment): void {
    const $dialog = this._dialog.open(CalendarDeleteDialogComponent, {
      width: '32rem',
      data: value,
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (period) => {
        if (period) this.refreshPeriods();
      },
    });
  }

  public openAddScheduleDialog(event: CalendarSlot) {
    const firstHour = new Date(`${defaultDate}T${event.hour}`);
    const lastHour = addHours(firstHour, 1);

    const schedule: Partial<SchedulePartsFragment> = {
      day: parseInt(event.day, 10),
      start: firstHour.toISOString(),
      end: lastHour.toISOString(),
    };

    const $dialog = this._dialog.open(ScheduleFormDialogComponent, {
      width: '32rem',
      data: schedule,
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (period) => {
        if (period) this.refreshSchedules();
      },
    });
  }

  public openFormScheduleDialog(
    event: MouseEvent,
    schedule: SchedulePartsFragment
  ) {
    event.stopPropagation();

    const $dialog = this._dialog.open(ScheduleFormDialogComponent, {
      width: '32rem',
      data: {
        ...schedule,
        start: new Date(`${defaultDate}T${schedule.start}`).toISOString(),
        end: new Date(`${defaultDate}T${schedule.end}`).toISOString(),
      },
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (period) => {
        if (period) this.refreshSchedules();
      },
    });
  }

  public refreshPeriods(accumulared: PeriodPartsFragment[] = []): void {
    if (!!this._globalStateService.branch?.id) {
      const limit = 50;
      const offset = accumulared.length;

      const params: GetPeriodsPageQueryVariables = {
        limit,
        offset,
        filter: {
          branchId: { eq: this._globalStateService.branch!.id },
          name: { iLike: `%${this.searchControl.value}%` },
        },
      };

      this.periodsLoading.set(true);

      const getPeriods$ = this._periodsPageGQL
        .watch({
          variables: params,
          fetchPolicy: 'cache-and-network',
          nextFetchPolicy: 'cache-and-network',
          notifyOnNetworkStatusChange: true,
        })
        .valueChanges;

      getPeriods$.pipe(
        tap((resp) => this.periodsLoading.set(resp.loading)),
        map((resp) => resp.data?.periods)
      ).subscribe({
        next: (periods) => {
          if (!periods) {
            return;
          }

          const { nodes = [], totalCount = 0 } = periods;
          const typedNodes = nodes as PeriodPartsFragment[];

          const allItems = accumulared.concat(typedNodes);

          if (allItems.length >= totalCount) {
            this.periods.set(allItems);
            this.periodsTotalCount.set(totalCount);
            return; // No more activities to fetch
          }

          this.refreshPeriods(allItems);
        },
        error: (error) => {
          console.error('Error fetching activities', error);
          this.periodsLoading.set(false);
        },
      });
    } else {
      this.periods.set([]);
      this.periodsLoading.set(false);
      this.periodsTotalCount.set(0);
    }
  }

  public refreshSchedules(accumulared: SchedulePartsFragment[] = []): void {
    if (!!this._globalStateService.period?.id) {
      const limit = 50;
      const offset = accumulared.length;

      const params: GetSchedulesPageQueryVariables = {
        filter: { periodId: { eq: this._globalStateService.period!.id } },
        limit,
        offset,
      };

      this.schedulesLoading.set(true);

      const getSchedules$ = this._schedulesPageGQL
        .watch({
          variables: params,
          fetchPolicy: 'cache-and-network',
          nextFetchPolicy: 'cache-and-network',
          notifyOnNetworkStatusChange: true,
        })
        .valueChanges;

      getSchedules$.pipe(
        tap((resp) => this.schedulesLoading.set(resp.loading)),
        map((resp) => resp.data?.schedules)
      ).subscribe({
        next: (schedules) => {
          if (!schedules) {
            return;
          }

          const { nodes = [], totalCount = 0 } = schedules;
          const typedNodes = nodes as SchedulePartsFragment[];

          const allItems = accumulared.concat(typedNodes);

          if (allItems.length >= totalCount) {
            this.schedules.set(allItems);
            this.schedulesTotalCount.set(totalCount);
            return; // No more fees to fetch
          }

          this.refreshSchedules(allItems);
        },
        error: (error) => {
          console.error('Error fetching fees', error);
          this.schedulesLoading.set(false);
        },
      });
    } else {
      this.schedules.set([]);
      this.schedulesLoading.set(false);
      this.schedulesTotalCount.set(0);
    }
  }

  public dropPeriod(event: CdkDragDrop<PeriodPartsFragment[]>) {
    this.periods.update((previous) => {
      const values = [...previous];
      moveItemInArray(values, event.previousIndex, event.currentIndex);
      return values;
    });

    this.updateOrderPeriods();
  }

  private updateOrderPeriods(): void {
    const payload: SetOrderInput[] = this.periods().map((item, index) => ({
      id: item.id,
      order: index + 1,
    }));

    this._setOrderPeriodsGQL.mutate({ variables: { payload } }).subscribe({
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
