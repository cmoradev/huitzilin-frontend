import { CurrencyPipe } from '@angular/common';
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
  DiscountFilter,
  DiscountPartsFragment,
  GetDiscountsPageGQL,
} from '@graphql';
import { GlobalStateService } from '@services';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { DiscountFormDialogComponent } from './discount-form-dialog/discount-form-dialog.component';
import { DiscountDeleteDialogComponent } from './discount-delete-dialog/discount-delete-dialog.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-discounts',
  imports: [
    MatCardModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    CurrencyPipe
  ],
  templateUrl: './discounts.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class DiscountsComponent {
  public readonly paginator = viewChild.required<MatPaginator>('paginator');

  public readonly searchTerm = signal('');

  public displayedColumns: string[] = ['name', 'actions'];
  public dataSource = new MatTableDataSource<DiscountPartsFragment>([]);

  public loading = signal<boolean>(false);
  public totalCount = signal<number>(0);

  private readonly dialog = inject(MatDialog);
  private readonly _discountsPageGQL = inject(GetDiscountsPageGQL);
  private readonly _globalStateService = inject(GlobalStateService);

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

      if (!filter) {
        return;
      }

      const limit = paginator.pageSize;
      const offset = paginator.pageIndex * limit;

      this._discountsPageGQL
        .watch({
          variables: { limit, offset, filter },
          fetchPolicy: 'cache-and-network',
          nextFetchPolicy: 'cache-and-network',
          notifyOnNetworkStatusChange: true,
        })
        .valueChanges.subscribe({
          next: ({ data, loading }) => {
            const discounts = data?.discounts;
            const nodes = (discounts?.nodes ??
              []) as DiscountPartsFragment[];
            const totalCount = discounts?.totalCount ?? 0;

            this.dataSource.data = nodes;

            this.loading.set(loading);
            this.totalCount.set(totalCount);
          },
        });
    });
  }

  private _buildFilter(term: string): DiscountFilter | null {
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
    value: DiscountPartsFragment | undefined = undefined
  ): void {
    const $dialog = this.dialog.open(DiscountFormDialogComponent, {
      width: '32rem',
      data: value,
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (discount) => {
        if (discount) this.refresh();
      },
    });
  }

  public openDeleteDialog(value: DiscountPartsFragment): void {
    const $dialog = this.dialog.open(DiscountDeleteDialogComponent, {
      width: '32rem',
      data: value,
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (discount) => {
        if (discount) this.refresh();
      },
    });
  }

  public refresh(): void {
    this.refreshTrigger.update((v) => v + 1);
  }
}