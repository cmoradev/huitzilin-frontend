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
import {
  GetPoliciesPageGQL,
  PolicyFilter,
  PolicyPartsFragment,
} from '@graphql';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { PolicyDeleteDialogComponent } from './policy-delete-dialog/policy-delete-dialog.component';
import { PolicyFormDialogComponent } from './policy-form-dialog/policy-form-dialog.component';

@Component({
  selector: 'app-policies',
  imports: [
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './policies.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class PoliciesComponent {
  public readonly paginator = viewChild.required<MatPaginator>('paginator');

  public readonly searchTerm = signal('');

  public displayedColumns: string[] = ['name', 'actions'];
  public dataSource = new MatTableDataSource<PolicyPartsFragment>([]);

  public loading = signal<boolean>(false);
  public totalCount = signal<number>(0);

  private readonly dialog = inject(MatDialog);
  private readonly _policiesPageGQL = inject(GetPoliciesPageGQL);

  private readonly _debouncedSearchTerm = signal('');

  constructor() {
    toObservable(this.searchTerm)
      .pipe(debounceTime(300))
      .subscribe((term) => this._debouncedSearchTerm.set(term));

    effect(() => {
      const paginator = this.paginator();
      const filter = this._buildFilter(this._debouncedSearchTerm());

      const limit = paginator.pageSize;
      const offset = paginator.pageIndex * limit;

      this._policiesPageGQL
        .watch({
          variables: { limit, offset, filter },
          fetchPolicy: 'cache-and-network',
          nextFetchPolicy: 'cache-and-network',
          notifyOnNetworkStatusChange: true,
        })
        .valueChanges.subscribe({
          next: ({ data, loading }) => {
            const policies = data?.policies;
            const nodes = (policies?.nodes ?? []) as PolicyPartsFragment[];
            const totalCount = policies?.totalCount ?? 0;

            this.dataSource.data = nodes;

            this.loading.set(loading);
            this.totalCount.set(totalCount);
          },
        });
    });
  }

  private _buildFilter(term: string): PolicyFilter {
    return { or: [{ name: { iLike: `%${term}%` } }] };
  }

  public onSearchInput(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  public refresh(): void {
    const paginator = this.paginator();
    const filter = this._buildFilter(this.searchTerm());

    const limit = paginator.pageSize;
    const offset = paginator.pageIndex * limit;

    this._policiesPageGQL
      .watch({
        variables: { limit, offset, filter },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      })
      .valueChanges.subscribe({
        next: ({ data, loading }) => {
          const policies = data?.policies;
          const nodes = (policies?.nodes ?? []) as PolicyPartsFragment[];
          const totalCount = policies?.totalCount ?? 0;

          this.dataSource.data = nodes;

          this.loading.set(loading);
          this.totalCount.set(totalCount);
        },
      });
  }

  public openFormDialog(
    user: PolicyPartsFragment | undefined = undefined
  ): void {
    const $dialog = this.dialog.open(PolicyFormDialogComponent, {
      width: '32rem',
      data: user,
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (user) => {
        if (user) this.refresh();
      },
    });
  }

  public openDeleteDialog(
    user: PolicyPartsFragment | undefined = undefined
  ): void {
    const $dialog = this.dialog.open(PolicyDeleteDialogComponent, {
      width: '32rem',
      data: user,
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (user) => {
        if (user) this.refresh();
      },
    });
  }
}