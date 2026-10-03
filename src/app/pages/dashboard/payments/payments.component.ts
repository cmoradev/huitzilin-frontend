import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { StudentStateComponent } from '@components/student-state/student-state.component';
import {
  CurrentEnrollmentPartsFragment,
  EnrollmentState,
  GetCurrentEnrollmentsPageGQL,
  GetEnrollmentsPageQueryVariables,
} from '@graphql';
import { GlobalStateService, PosService } from '@services';
import { NgScrollbar } from 'ngx-scrollbar';
import { map, merge } from 'rxjs';
import { EnrollmentWithDebitsComponent } from './enrollment-with-debits/enrollment-with-debits.component';
import { SaleDetailsComponent } from './sale-details/sale-details.component';

@Component({
  selector: 'app-payments',
  imports: [
    NgScrollbar,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    SaleDetailsComponent,
    StudentStateComponent,
    EnrollmentWithDebitsComponent,
  ],
  templateUrl: './payments.component.html',
  styles: ``,
})
export class PaymentsComponent implements OnInit {
  private readonly _globalState = inject(GlobalStateService);
  private readonly _getEnrollmentsPage = inject(GetCurrentEnrollmentsPageGQL);
  private readonly _pos = inject(PosService);

  public enrollments = signal<CurrentEnrollmentPartsFragment[]>([]);
  public loading = signal<boolean>(true);

  ngOnInit(): void {
    this._pos.clearConcepts();
    
    merge(this._globalState.student$, this._globalState.cycle$).subscribe({
      next: () => {
        this._pos.clearConcepts();
        this._fetchAllEnrollments();
      },
    });
  }

  public refresh() {
    this.enrollments.set([]);

    setTimeout(() => {
      this._fetchAllEnrollments();
    }, 50);
  }

  private _fetchAllEnrollments(
    accumulared: CurrentEnrollmentPartsFragment[] = []
  ): void {
    if (!!this._globalState.student?.id && !!this._globalState.cycle?.id) {
      this.loading.set(true);

      const limit = 50;
      const offset = accumulared.length;

      const params: GetEnrollmentsPageQueryVariables = {
        filter: {
          studentId: { eq: this._globalState.student!.id },
          cycleId: { eq: this._globalState.cycle!.id },
          state: { eq: EnrollmentState.Active },
        },
        limit,
        offset,
      };

      const getEnrollments$ = this._getEnrollmentsPage
        .watch({
          variables: params,
          fetchPolicy: 'cache-and-network', // Usa cache primero, solo pide a la API si no hay datos en cache
          nextFetchPolicy: 'cache-and-network', // Mantiene la política de cache en siguientes peticiones
          notifyOnNetworkStatusChange: false, // No notifica cambios de red para evitar refetch innecesario
        })
        .valueChanges;

      getEnrollments$.pipe(map((resp) => resp.data?.enrollments)).subscribe({
        next: (enrollments) => {
          if (!enrollments) return;

          const nodes = (enrollments.nodes ??
            []) as CurrentEnrollmentPartsFragment[];
          const totalCount = enrollments.totalCount ?? 0;

          const allItems = accumulared.concat(nodes);

          if (allItems.length >= totalCount) {
            this.enrollments.set(allItems);
            this.loading.set(false);
            return; // No more enrollments to fetch
          }

          this._fetchAllEnrollments(allItems);
        },
        error: (error) => {
          console.error('Error fetching enrollments', error);
        },
      });
    }
  }
}
