import { Component, inject, input, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  CurrentEnrollmentPartsFragment,
  DebitPartsFragment,
  DebitState,
  GetDebitsPageGQL,
  GetDebitsPageQueryVariables,
} from '@graphql';
import { map } from 'rxjs';
import { ConceptOptionComponent } from '../concept-option/concept-option.component';
import { AvatarComponent } from '@components/avatar/avatar.component';
import { PosService } from '@services';

@Component({
  selector: 'app-enrollment-with-debits',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    AvatarComponent,
    ConceptOptionComponent,
  ],
  templateUrl: './enrollment-with-debits.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./enrollment-with-debits.component.scss'],
})
export class EnrollmentWithDebitsComponent implements OnInit {
  private readonly _dialog = inject(MatDialog);
  private readonly _getDebitsPage = inject(GetDebitsPageGQL);

  public enrollment = input.required<CurrentEnrollmentPartsFragment>();
  public pos = inject(PosService);

  public expanded = signal<boolean>(true);
  public loading = signal<boolean>(false);
  public debits = signal<DebitPartsFragment[]>([]);

  ngOnInit(): void {
    this._fetchAllDebits();
  }

  public refreshDebits(): void {
    this._resetState();
    this._fetchAllDebits();
  }

  public toggleExpanded(): void {
    this.expanded.update((current) => !current);
  }

  private _fetchAllDebits(accumulared: DebitPartsFragment[] = []): void {
    if (!!this.enrollment().id) {
      this.loading.set(true);

      const limit = 50;
      const offset = accumulared.length;

      const params: GetDebitsPageQueryVariables = {
        filter: {
          enrollmentId: { eq: this.enrollment().id },
          state: { in: [DebitState.Debt, DebitState.PartiallyPaid] },
        },
        limit,
        offset,
      };

      const getDebits$ = this._getDebitsPage
        .watch({
          variables: params,
          fetchPolicy: 'cache-and-network', // Usa cache primero, solo pide a la API si no hay datos en cache
          nextFetchPolicy: 'cache-and-network', // Mantiene la política de cache en siguientes peticiones
          notifyOnNetworkStatusChange: false, // No notifica cambios de red para evitar refetch innecesario
        })
        .valueChanges;

      getDebits$.pipe(map((resp) => resp.data?.debits)).subscribe({
        next: (debits) => {
          if (!debits) return;

          const nodes = (debits.nodes ?? []) as DebitPartsFragment[];
          const totalCount = debits.totalCount ?? 0;

          const allItems = accumulared.concat(nodes);

          if (allItems.length >= totalCount) {
            this.debits.set(allItems);
            this.loading.set(false);
            return; // No more enrollments to fetch
          }

          this._fetchAllDebits(allItems);
        },
        error: (error) => {
          console.error('Error fetching enrollments', error);
        },
      });
    }
  }

  private _resetState(): void {
    this.loading.set(false);
    this.debits.set([]);
  }
}
