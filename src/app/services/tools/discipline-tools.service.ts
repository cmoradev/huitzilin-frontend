import { inject, Injectable, signal } from '@angular/core';
import {
  DisciplinePartsFragment,
  GetDisciplinesPageGQL,
  GetDisciplinesPageQueryVariables,
} from '@graphql';
import { map } from 'rxjs';
import { GlobalStateService } from '../global-state.service';

@Injectable({ providedIn: 'root' })
export class DisciplineToolsService {
  private readonly _globalState = inject(GlobalStateService);
  private readonly _fetch = inject(GetDisciplinesPageGQL);

  public options = signal<DisciplinePartsFragment[]>([]);
  public loading = signal<boolean>(false);

  public fetch(query: string): void {
    if (!!this._globalState.branch?.id) {
        this.loading.set(true);
    
        const variables: GetDisciplinesPageQueryVariables = {
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
              const nodes = data?.disciplines?.nodes as DisciplinePartsFragment[];
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

  public fetchAll(accumulared: DisciplinePartsFragment[] = []): void {
    if (!!this._globalState.branch?.id) {
        this.loading.set(true);

      const limit = 50;
      const offset = accumulared.length;

      const variables: GetDisciplinesPageQueryVariables = {
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

      fetch$.pipe(map((resp) => resp.data?.disciplines)).subscribe({
        next: (disciplines) => {
          if (!disciplines) {
            return;
          }

          const { nodes = [], totalCount = 0 } = disciplines;
          const typedNodes = nodes as DisciplinePartsFragment[];

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
  }
  
  public displayFn(option: DisciplinePartsFragment | null) {
    return option?.name ?? '';
  }
}
