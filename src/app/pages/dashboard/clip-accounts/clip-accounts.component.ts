import { NgClass } from '@angular/common';
import { Component, inject, signal, ViewChild, ChangeDetectionStrategy } from '@angular/core';
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
import {
  ClipAccountFilter,
  ClipAccountPartsFragment,
  GetClipAccountsPageGQL,
} from '@graphql';
import { debounceTime, merge, startWith } from 'rxjs';
import { ClipAccountFormDialogComponent } from './clip-account-form-dialog/clip-account-form-dialog.component';
import { ClipAccountDeleteDialogComponent } from './clip-account-delete-dialog/clip-account-delete-dialog.component';

@Component({
  selector: 'app-clip-accounts',
  imports: [
    NgClass,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './clip-accounts.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class ClipAccountsComponent {
  @ViewChild('paginator') public paginator!: MatPaginator;
  public searchControl = new FormControl('');

  public displayedColumns: string[] = ['name', 'actions'];
  public dataSource = new MatTableDataSource<ClipAccountPartsFragment>([]);

  public loading = signal(false);
  public totalCount = signal(0);

  private readonly dialog = inject(MatDialog);
  private readonly _clipAccountsPageGQL = inject(GetClipAccountsPageGQL);

  ngAfterViewInit(): void {
    merge(this.paginator.page, this.searchControl.valueChanges)
      .pipe(debounceTime(300), startWith({}))
      .subscribe({
        next: () => {
          this.refresh();
        },
      });
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

  public refresh() {
    const limit: number = this.paginator.pageSize;
    const offset: number = this.paginator.pageIndex * limit;

    const filter: ClipAccountFilter = {
      name: { iLike: `%${this.searchControl.value}%` },
    };

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
  }
}
