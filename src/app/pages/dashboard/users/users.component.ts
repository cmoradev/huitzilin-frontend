import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GetUsersPageGQL, UserFilter, UserPartsFragment } from '@graphql';
import { debounceTime, merge, startWith } from 'rxjs';
import { UserFormDialogComponent } from './user-form-dialog/user-form-dialog.component';
import { UserDeleteDialogComponent } from './user-delete-dialog/user-delete-dialog.component';
import { UserPoliciesDialogComponent } from './user-policies-dialog/user-policies-dialog.component';

@Component({
  selector: 'app-users',
  imports: [
    NgClass,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './users.component.html',
  styles: ``,
})
export class UsersComponent implements AfterViewInit {
  @ViewChild('paginator') public paginator!: MatPaginator;
  public searchControl = new FormControl('');

  public displayedColumns: string[] = ['name', 'actions'];
  public dataSource = new MatTableDataSource<UserPartsFragment>([]);

  public loading = signal<boolean>(false);
  public totalCount = signal<number>(0);

  private readonly dialog = inject(MatDialog);
  private readonly _usersPageGQL = inject(GetUsersPageGQL);

  ngAfterViewInit(): void {
    merge(this.paginator.page, this.searchControl.valueChanges)
      .pipe(debounceTime(300), startWith({}))
      .subscribe({
        next: () => {
          this.refresh();
        },
      });
  }

  public refresh() {
    const limit: number = this.paginator.pageSize;
    const offset: number = this.paginator.pageIndex * limit;

    const filter: UserFilter = {
      or: [
        { email: { iLike: `%${this.searchControl.value}%` } },
        { username: { iLike: `%${this.searchControl.value}%` } },
      ],
    };

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
