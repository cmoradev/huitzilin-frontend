import { inject, Injectable, signal } from '@angular/core';
import {
  GetCyclesPageGQL,
  CyclePartsFragment,
  GetCyclesPageQueryVariables,
} from '@graphql';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CycleToolsService {
  private readonly _fetch = inject(GetCyclesPageGQL);

  public options = signal<CyclePartsFragment[]>([]);
  public loading = signal<boolean>(false);

  public fetch(query: string): void {
    this.loading.set(true);

    const variables: GetCyclesPageQueryVariables = {
      limit: 50,
      filter: { name: { iLike: `%${query}%` } },
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
          const nodes = data?.cycles?.nodes as CyclePartsFragment[];
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

  public fetchAll(accumulared: CyclePartsFragment[] = []): void {
    this.loading.set(true);

    const limit = 50;
    const offset = accumulared.length;

    const variables: GetCyclesPageQueryVariables = {
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

    fetch$.pipe(map((resp) => resp.data?.cycles)).subscribe({
      next: (cycles) => {
        if (!cycles) {
          return;
        }

        const { nodes = [], totalCount = 0 } = cycles;
        const typedNodes = nodes as CyclePartsFragment[];

        const allItems = accumulared.concat(typedNodes);

        if (allItems.length >= totalCount) {
          this.options.set(allItems);
          this.loading.set(false);
          return; // No more fees to fetch
        }

        this.fetchAll(allItems);
      },
      error: (error) => {
        console.error('Error fetching disciplines', error);
        this.loading.set(false);
      },
    });
  }

  public displayFn(option: CyclePartsFragment | null) {
    return option?.name ?? '';
  }
}
