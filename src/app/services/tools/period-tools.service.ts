import { inject, Injectable, signal } from '@angular/core';
import {
  PeriodPartsFragment,
  GetPeriodsPageQueryVariables,
  GetPeriodsPageGQL,
} from '@graphql';
import { map } from 'rxjs';
import { GlobalStateService } from '../global-state.service';

@Injectable({ providedIn: 'root' })
export class PeriodToolsService {
  private readonly _globalState = inject(GlobalStateService);
  private readonly _fetch = inject(GetPeriodsPageGQL);

  public options = signal<PeriodPartsFragment[]>([]);
  public loading = signal<boolean>(false);

  public fetch(query: string): void {
    if (!!this._globalState.branch?.id) {
      this.loading.set(true);

      const variables: GetPeriodsPageQueryVariables = {
        limit: 50,
        filter: {
          name: { iLike: `%${query}%` },
          branchId: { eq: this._globalState.branch!.id },
        },
      };

      const fetch$ = this._fetch
        .watch({
          variables,
          fetchPolicy: 'cache-and-network',
          nextFetchPolicy: 'cache-and-network',
          notifyOnNetworkStatusChange: true,
        })
        .valueChanges;

      fetch$
        .pipe(
          map(({ data, loading }) => {
            const nodes = data?.periods?.nodes as PeriodPartsFragment[];
            if (!data || !nodes) {
              this.loading.set(loading);
              return [];
            }

            this.loading.set(loading);
            this.options.set(nodes);
            return nodes;
          })
        )
        .subscribe({
          next: () => {
            // do nothing
          },
        });
    }
  }

  public fetchAll(accumulared: PeriodPartsFragment[] = []): void {
    if (!!this._globalState.branch?.id) {
      this.loading.set(true);

      const limit = 50;
      const offset = accumulared.length;

      const variables: GetPeriodsPageQueryVariables = {
        filter: { branchId: { eq: this._globalState.branch!.id } },
        limit,
        offset,
      };

      const fetch$ = this._fetch
        .watch({
          variables,
          fetchPolicy: 'cache-and-network', // Usa cache primero, solo pide a la API si no hay datos en cache
          nextFetchPolicy: 'cache-and-network', // Mantiene la política de cache en siguientes peticiones
          notifyOnNetworkStatusChange: false, // No notifica cambios de red para evitar refetch innecesario
        })
        .valueChanges;

      fetch$.pipe(map((resp) => resp.data?.periods)).subscribe({
        next: (periods) => {
          if (!periods) {
            return;
          }

          const { nodes = [], totalCount = 0 } = periods;
          const typedNodes = nodes as PeriodPartsFragment[];

          const allItems = accumulared.concat(typedNodes);

          if (allItems.length >= totalCount) {
            this.options.set(allItems);
            this.loading.set(false);
            return; // No more fees to fetch
          }

          this.fetchAll(allItems);
        },
        error: (error) => {
          console.error('Error fetching periods', error);
          this.loading.set(false);
        },
      });
    }
  }

  public displayFn(option: PeriodPartsFragment | null) {
    return option?.name ?? '';
  }

  public compareFn(
    option1: PeriodPartsFragment | null,
    option2: PeriodPartsFragment | null
  ): boolean {
    return option1?.id === option2?.id;
  }
}
