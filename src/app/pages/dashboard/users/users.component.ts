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
import { GetUsersPageGQL, UserFilter, UserPartsFragment } from '@graphql';
import { debounceTime } from 'rxjs';
import { UserFormDialogComponent } from './user-form-dialog/user-form-dialog.component';
import { UserDeleteDialogComponent } from './user-delete-dialog/user-delete-dialog.component';
import { UserPoliciesDialogComponent } from './user-policies-dialog/user-policies-dialog.component';

@Component({
  selector: 'app-users',
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
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class UsersComponent {
  public readonly paginator = viewChild.required<MatPaginator>('paginator');
  public readonly searchTerm = signal('');

  public displayedColumns: string[] = ['name', 'actions'];
  public dataSource = new MatTableDataSource<UserPartsFragment>([]);

  public loading = signal<boolean>(false);
  public totalCount = signal<number>(0);

  private readonly dialog = inject(MatDialog);
  private readonly _usersPageGQL = inject(GetUsersPageGQL);

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

      this._usersPageGQL
        .watch({
          variables: { limit, offset, filter },
          fetchPolicy: 'cache-and-network',
          nextFetchPolicy: 'cache-and-network',
          notifyOnNetworkStatusChange: true,
        })
        .valueChanges.subscribe({
          next: ({ data, loading }) => {
            const users = data?.users;
            const nodes = (users?.nodes ?? []) as UserPartsFragment[];
            const totalCount = users?.totalCount ?? 0;

            this.dataSource.data = nodes;

            this.loading.set(loading);
            this.totalCount.set(totalCount);
          },
        });
    });
  }

  private _buildFilter(term: string): UserFilter {
    return {
      or: [
        { email: { iLike: `%${term}%` } },
        { username: { iLike: `%${term}%` } },
      ],
    };
  }

  public onSearchInput(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  public refresh(): void {
    const paginator = this.paginator();
    const filter = this._buildFilter(this.searchTerm());

    const limit = paginator.pageSize;
    const offset = paginator.pageIndex * limit;

    this._usersPageGQL
      .watch({
        variables: { limit, offset, filter },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      })
      .valueChanges.subscribe({
        next: ({ data, loading }) => {
          const users = data?.users;
          const nodes = (users?.nodes ?? []) as UserPartsFragment[];
          const totalCount = users?.totalCount ?? 0;

          this.dataSource.data = nodes;

          this.loading.set(loading);
          this.totalCount.set(totalCount);
        },
      });
  }

  public openPoliciesDialog(
    user: UserPartsFragment | undefined = undefined
  ): void {
    this.dialog.open(UserPoliciesDialogComponent, {
      width: '32rem',
      data: user,
      disableClose: true,
    });
  }

  public openFormDialog(user: UserPartsFragment | undefined = undefined): void {
    const $dialog = this.dialog.open(UserFormDialogComponent, {
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
    user: UserPartsFragment | undefined = undefined
  ): void {
    const $dialog = this.dialog.open(UserDeleteDialogComponent, {
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