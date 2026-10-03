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
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ClipAccountFilter,
  ClipAccountPartsFragment,
  GetClipAccountsPageGQL,
} from '@graphql';
import { debounceTime } from 'rxjs';
import { ClipAccountFormDialogComponent } from './clip-account-form-dialog/clip-account-form-dialog.component';
import { ClipAccountDeleteDialogComponent } from './clip-account-delete-dialog/clip-account-delete-dialog.component';

@Component({
  selector: 'app-clip-accounts',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
  ],
  templateUrl: './clip-accounts.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class ClipAccountsComponent {
  public readonly paginator = viewChild.required<MatPaginator>('paginator');

  public readonly searchTerm = signal('');

  public displayedColumns: string[] = ['name', 'actions'];
  public dataSource = new MatTableDataSource<ClipAccountPartsFragment>([]);

  public loading = signal(false);
  public totalCount = signal(0);

  private readonly dialog = inject(MatDialog);
  private readonly _clipAccountsPageGQL = inject(GetClipAccountsPageGQL);

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

      this._clipAccountsPageGQL
        .watch({
          variables: { limit, offset, filter },
          fetchPolicy: 'cache-and-network',
          nextFetchPolicy: 'cache-and-network',
          notifyOnNetworkStatusChange: true,
        })
        .valueChanges.subscribe({
          next: ({ data, loading }) => {
            const clipAccounts = data?.clipAccounts;
            const nodes = (clipAccounts?.nodes ?? []) as ClipAccountPartsFragment[];
            const totalCount = clipAccounts?.totalCount ?? 0;

            this.dataSource.data = nodes;

            this.loading.set(loading);
            this.totalCount.set(totalCount);
          },
        });
    });
  }

  private _buildFilter(term: string): ClipAccountFilter {
    return { name: { iLike: `%${term}%` } };
  }

  public onSearchInput(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  public openFormDialog(
    value: ClipAccountPartsFragment | undefined = undefined
  ): void {
    const $dialog = this.dialog.open(ClipAccountFormDialogComponent, {
      width: '32rem',
      data: value,
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (account) => {
        if (account) this.refresh();
      },
    });
  }

  public openDeleteDialog(value: ClipAccountPartsFragment): void {
    const $dialog = this.dialog.open(ClipAccountDeleteDialogComponent, {
      data: value,
      width: '32rem',
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (account) => {
        if (account) this.refresh();
      },
    });
  }

  public refresh(): void {
    this.refreshTrigger.update((v) => v + 1);
  }
}