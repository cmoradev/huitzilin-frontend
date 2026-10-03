import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CycleFilter, CyclePartsFragment, GetCyclesPageGQL } from '@graphql';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { CycleFormDialogComponent } from './cycle-form-dialog/cycle-form-dialog.component';
import { CycleDeleteDialogComponent } from './cycle-delete-dialog/cycle-delete-dialog.component';

@Component({
  selector: 'app-cycles',
  imports: [
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  templateUrl: './cycles.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class CyclesComponent {
  public readonly paginator = viewChild.required<MatPaginator>('paginator');

  public readonly searchTerm = signal('');

  public displayedColumns: string[] = ['name', 'actions'];
  public dataSource = new MatTableDataSource<CyclePartsFragment>([]);

  public loading = signal(false);
  public totalCount = signal(0);

  private readonly dialog = inject(MatDialog);
  private readonly _cyclesPageGQL = inject(GetCyclesPageGQL);

  public readonly refreshTrigger = signal(0);

  private readonly _debouncedSearchTerm = signal('');

  constructor() {
    toObservable(this.searchTerm)
      .pipe(debounceTime(300))
      .subscribe((term) => this._debouncedSearchTerm.set(term));

    effect(() => {
      const paginator = this.paginator();
      const filter = this._buildFilter(this._debouncedSearchTerm());
      this.refreshTrigger();

      const limit = paginator.pageSize;
      const offset = paginator.pageIndex * limit;

      this._cyclesPageGQL
        .watch({
          variables: { limit, offset, filter },
          fetchPolicy: 'cache-and-network',
          nextFetchPolicy: 'cache-and-network',
          notifyOnNetworkStatusChange: true,
        })
        .valueChanges.subscribe({
          next: ({ data, loading }) => {
            const cycles = data?.cycles;
            const nodes = (cycles?.nodes ?? []) as CyclePartsFragment[];
            const totalCount = cycles?.totalCount ?? 0;

            this.dataSource.data = nodes;

            this.loading.set(loading);
            this.totalCount.set(totalCount);
          },
        });
    });
  }

  private _buildFilter(term: string): CycleFilter {
    return { name: { iLike: `%${term}%` } };
  }

  public onSearchInput(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  public openFormDialog(
    value: CyclePartsFragment | undefined = undefined
  ): void {
    const $dialog = this.dialog.open(CycleFormDialogComponent, {
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

  public openDeleteDialog(value: CyclePartsFragment): void {
    const $dialog = this.dialog.open(CycleDeleteDialogComponent, {
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
    this.refreshTrigger.update((v) => v + 1);
  }
}