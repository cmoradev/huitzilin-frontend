import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  DisciplineFilter,
  DisciplinePartsFragment,
  GetDisciplinesPageGQL,
} from '@graphql';
import { GlobalStateService } from '@services';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { DisciplineDeleteDialogComponent } from './discipline-delete-dialog/discipline-delete-dialog.component';
import { DisciplineFormDialogComponent } from './discipline-form-dialog/discipline-form-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-disciplines',
  imports: [
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    MatTooltipModule,
  ],
  templateUrl: './disciplines.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class DisciplinesComponent {
  public readonly paginator = viewChild.required<MatPaginator>('paginator');
  public readonly searchTerm = signal('');

  public displayedColumns: string[] = ['name', 'actions'];
  public dataSource = new MatTableDataSource<DisciplinePartsFragment>([]);

  public loading = signal<boolean>(false);
  public totalCount = signal<number>(0);

  private readonly dialog = inject(MatDialog);
  private readonly _disciplinesPageGQL = inject(GetDisciplinesPageGQL);
  private readonly _globalStateService = inject(GlobalStateService);

  private readonly _branch = toSignal(this._globalStateService.branch$, {
    initialValue: this._globalStateService.branch,
  });

  private readonly _debouncedSearchTerm = signal('');

  constructor() {
    toObservable(this.searchTerm)
      .pipe(debounceTime(300))
      .subscribe((term) => this._debouncedSearchTerm.set(term));

    effect(() => {
      const branch = this._branch();
      const paginator = this.paginator();
      const filter = this._buildFilter(this._debouncedSearchTerm());

      if (!branch?.id || !filter) {
        return;
      }

      const limit = paginator.pageSize;
      const offset = paginator.pageIndex * limit;

      this._disciplinesPageGQL
        .watch({
          variables: { limit, offset, filter },
          fetchPolicy: 'cache-and-network',
          nextFetchPolicy: 'cache-and-network',
          notifyOnNetworkStatusChange: true,
        })
        .valueChanges.subscribe({
          next: ({ data, loading }) => {
            const disciplines = data?.disciplines;
            const nodes = (disciplines?.nodes ??
              []) as DisciplinePartsFragment[];
            const totalCount = disciplines?.totalCount ?? 0;

            this.dataSource.data = nodes;

            this.loading.set(loading);
            this.totalCount.set(totalCount);
          },
        });
    });
  }

  private _buildFilter(term: string): DisciplineFilter | null {
    const branch = this._globalStateService.branch;
    if (!branch?.id) {
      return null;
    }

    return {
      name: { iLike: `%${term}%` },
      branchId: { eq: branch.id },
    };
  }

  public onSearchInput(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  public openFormDialog(
    value: DisciplinePartsFragment | undefined = undefined
  ): void {
    const $dialog = this.dialog.open(DisciplineFormDialogComponent, {
      width: '32rem',
      data: value,
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (cycle) => {
        if (cycle) this.refresh();
      },
    });
  }

  public openDeleteDialog(value: DisciplinePartsFragment): void {
    const $dialog = this.dialog.open(DisciplineDeleteDialogComponent, {
      data: value,
      width: '32rem',
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (cycle) => {
        if (cycle) this.refresh();
      },
    });
  }

  public refresh(): void {
    const paginator = this.paginator();
    const filter = this._buildFilter(this.searchTerm());

    if (!filter) {
      return;
    }

    const limit = paginator.pageSize;
    const offset = paginator.pageIndex * limit;

    this._disciplinesPageGQL
      .watch({
        variables: { limit, offset, filter },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      })
      .valueChanges.subscribe({
        next: ({ data, loading }) => {
          const disciplines = data?.disciplines;
          const nodes = (disciplines?.nodes ??
            []) as DisciplinePartsFragment[];
          const totalCount = disciplines?.totalCount ?? 0;

          this.dataSource.data = nodes;

          this.loading.set(loading);
          this.totalCount.set(totalCount);
        },
      });
  }
}