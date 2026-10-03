import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Component, computed, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StudentStateComponent } from '@components/student-state/student-state.component';
import {
  DebitPartsFragment,
  EnrollmentPartsFragment,
  GetDebitsPageGQL,
  GetEnrollmentsPageGQL,
  GetEnrollmentsPageQueryVariables,
  SetOrderEnrollmentsGQL,
  SetOrderInput,
} from '@graphql';
import { GlobalStateService } from '@services';
import { NgScrollbar } from 'ngx-scrollbar';
import { debounceTime, map, merge, tap } from 'rxjs';
import { DebitDeleteDialogComponent } from './debit-delete-dialog/debit-delete-dialog.component';
import { DebitFormCatalogDialogComponent } from './debit-form-catalog-dialog/debit-form-catalog-dialog.component';
import { DebitFormDialogComponent } from './debit-form-dialog/debit-form-dialog.component';
import { DebitItemComponent } from './debit-item/debit-item.component';
import { EnrollmentDeleteDialogComponent } from './enrollment-delete-dialog/enrollment-delete-dialog.component';
import { EnrollmentFormDialogComponent } from './enrollment-form-dialog/enrollment-form-dialog.component';
import { EnrollmentItemComponent } from './enrollment-item/enrollment-item.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LightOnPricesComponent } from './light-on-prices/light-on-prices.component';

@Component({
  selector: 'app-enrollments',
  imports: [
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    NgScrollbar,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatMenuModule,
    DragDropModule,
    MatTooltipModule,
    StudentStateComponent,
    DebitItemComponent,
    EnrollmentItemComponent,
  ],
  templateUrl: './enrollments.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class EnrollmentsComponent implements OnInit {
  private readonly _dialog = inject(MatDialog);
  private readonly _globalStateService = inject(GlobalStateService);
  private readonly _snackBar = inject(MatSnackBar);

  public enrollment = computed(() => this._globalStateService.enrollment);
  public student = computed(() => this._globalStateService.student);
  public branch = computed(() => this._globalStateService.branch);
  public cycle = computed(() => this._globalStateService.cycle);

  private readonly _debitsPageGQL = inject(GetDebitsPageGQL);
  private readonly _enrollmentsPageGQL = inject(GetEnrollmentsPageGQL);
  private readonly _setOrderEnrollmentGQL = inject(SetOrderEnrollmentsGQL);

  public enrollmentsLoading = signal<boolean>(false);
  public enrollmentsTotalCount = signal<number>(0);
  public enrollments = signal<EnrollmentPartsFragment[]>([]);

  public debits = signal<DebitPartsFragment[]>([]);
  public debitsLoading = signal<boolean>(false);
  public debitsTotalCount = signal<number>(0);

  public searchControl = new FormControl('');

  ngOnInit(): void {
    merge(
      this._globalStateService.branch$,
      this._globalStateService.cycle$,
      this._globalStateService.student$,
      this.searchControl.valueChanges
    )
      .pipe(debounceTime(300))
      .subscribe({
        next: () => {
          this.refreshEnrollments();
        },
      });

    this._globalStateService.enrollment$.subscribe({
      next: () => {
        this.refreshDebits();
      },
    });
  }

  public openEnrollmentFormDialog(
    value: EnrollmentPartsFragment | undefined = undefined
  ): void {
    const $dialog = this._dialog.open(EnrollmentFormDialogComponent, {
      width: '32rem',
      maxWidth: '95vw',
      data: value,
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (enrollment) => {
        if (enrollment) this.refreshEnrollments();
      },
    });
  }

  public openEnrollmentDeleteDialog(value: EnrollmentPartsFragment): void {
    const $dialog = this._dialog.open(EnrollmentDeleteDialogComponent, {
      width: '32rem',
      data: value,
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (enrollment) => {
        if (enrollment) this.refreshEnrollments();
      },
    });
  }

  public openLightOnCatalogDialog(
    value: DebitPartsFragment | undefined = undefined
  ): void {
    const $dialog = this._dialog.open(LightOnPricesComponent, {
      width: '48rem',
      data: value,
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (debit) => {
        if (debit) this.refreshDebits();
      },
    });
  }

  public openDebitCatalogDialog(
    value: DebitPartsFragment | undefined = undefined
  ): void {
    const $dialog = this._dialog.open(DebitFormCatalogDialogComponent, {
      width: '48rem',
      data: value,
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (debit) => {
        if (debit) this.refreshDebits();
      },
    });
  }

  public openDebitFormDialog(
    value: DebitPartsFragment | undefined = undefined
  ): void {
    const $dialog = this._dialog.open(DebitFormDialogComponent, {
      width: '38rem',
      data: value,
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (debit) => {
        if (debit) this.refreshDebits();
      },
    });
  }

  public openDebitDeleteDialog(value: DebitPartsFragment): void {
    const $dialog = this._dialog.open(DebitDeleteDialogComponent, {
      width: '32rem',
      data: value,
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (debit) => {
        if (debit) this.refreshDebits();
      },
    });
  }

  public refreshEnrollments(accumulared: EnrollmentPartsFragment[] = []): void {
    if (
      !!this._globalStateService.branch?.id &&
      !!this._globalStateService.cycle?.id &&
      !!this._globalStateService.student?.id
    ) {
      const limit = 50;
      const offset = accumulared.length;

      const params: GetEnrollmentsPageQueryVariables = {
        limit,
        offset,
        filter: {
          branchId: { eq: this._globalStateService.branch!.id },
          studentId: { eq: this._globalStateService.student!.id },
          cycleId: { eq: this._globalStateService.cycle!.id },
          details: { iLike: `%${this.searchControl.value}%` },
        },
      };

      this.enrollmentsLoading.set(true);

      this._enrollmentsPageGQL
        .watch({
          variables: params,
          fetchPolicy: 'cache-and-network',
          nextFetchPolicy: 'cache-and-network',
          notifyOnNetworkStatusChange: true,
        })
        .valueChanges
        .pipe(
          tap((resp) => this.enrollmentsLoading.set(resp.loading)),
          map((resp) => resp.data?.enrollments)
        )
        .subscribe({
          next: (enrollments) => {
            if (!enrollments) {
              return;
            }

            const { nodes = [], totalCount = 0 } = enrollments;
            const typedNodes = nodes as EnrollmentPartsFragment[];

            const allItems = accumulared.concat(typedNodes);

            if (allItems.length >= totalCount) {
              this.enrollments.set(allItems);
              this.enrollmentsTotalCount.set(totalCount);
              return; // No more activities to fetch
            }

            this.refreshEnrollments(allItems);
          },
          error: (error) => {
            console.error('Error fetching activities', error);
            this.enrollmentsLoading.set(false);
          },
        });
    } else {
      this.enrollments.set([]);
      this.enrollmentsLoading.set(false);
      this.enrollmentsTotalCount.set(0);
    }
  }

  public refreshDebits(): void {
    if (!!this._globalStateService.enrollment?.id) {
      this.debitsLoading.set(true);

      // TODO: Cambiar el limit a 10 y usar un fetchMore scroll infinito
      this._debitsPageGQL
        .watch({
          variables: {
            filter: {
              enrollmentId: { eq: this._globalStateService.enrollment!.id },
            },

            limit: 50,
            offset: 0,
          },
          fetchPolicy: 'cache-and-network',
          nextFetchPolicy: 'cache-and-network',
          notifyOnNetworkStatusChange: true,
        })
        .valueChanges.subscribe({
          next: ({ data, loading }) => {
            const debits = data?.debits;
            const nodes = (debits?.nodes ?? []) as DebitPartsFragment[];
            const totalCount = debits?.totalCount ?? 0;

            this.debits.set(nodes);
            this.debitsLoading.set(loading);
            this.debitsTotalCount.set(totalCount);
          },
          error: (error) => {
            console.error('Error fetching debits', error);
            this.debitsLoading.set(false);
          },
        });
    } else {
      this.debits.set([]);
      this.debitsLoading.set(false);
      this.debitsTotalCount.set(0);
    }
  }

  public dropEnrollment(event: CdkDragDrop<EnrollmentPartsFragment[]>) {
    this.enrollments.update((previous) => {
      const values = [...previous];
      moveItemInArray(values, event.previousIndex, event.currentIndex);
      return values;
    });

    this.updateOrderEnrollments();
  }

  private updateOrderEnrollments(): void {
    const payload: SetOrderInput[] = this.enrollments().map((item, index) => ({
      id: item.id,
      order: index + 1,
    }));

    this._setOrderEnrollmentGQL.mutate({ variables: { payload } }).subscribe({
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
