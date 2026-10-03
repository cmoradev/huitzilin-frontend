import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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
import { debounceTime, merge, startWith } from 'rxjs';
import { DiscountFormDialogComponent } from './discount-form-dialog/discount-form-dialog.component';
import { DiscountDeleteDialogComponent } from './discount-delete-dialog/discount-delete-dialog.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-discounts',
  imports: [
    NgClass,
    MatCardModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    CurrencyPipe
  ],
  templateUrl: './discounts.component.html',
  styles: ``,
})
export class DiscountsComponent {
  @ViewChild('paginator') public paginator!: MatPaginator;
  public searchControl = new FormControl('');

  public displayedColumns: string[] = ['name', 'actions'];
  public dataSource = new MatTableDataSource<DiscountPartsFragment>([]);

  public loading = signal<boolean>(false);
  public totalCount = signal<number>(0);

  private readonly dialog = inject(MatDialog);
  private readonly _discountsPageGQL = inject(GetDiscountsPageGQL);
  private readonly _globalStateService = inject(GlobalStateService);

  ngAfterViewInit(): void {
    merge(
      this.paginator.page,
      this.searchControl.valueChanges,
      this._globalStateService.branch$
    )
      .pipe(debounceTime(300), startWith({}))
      .subscribe({
        next: () => this.refresh(),
      });
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
      data: value,
      width: '32rem',
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (discount) => {
        if (discount) this.refresh();
      },
    });
  }

  public refresh() {
    if (this._globalStateService.branch?.id) {
      const limit: number = this.paginator.pageSize;
      const offset: number = this.paginator.pageIndex * limit;

      const filter: DiscountFilter = {
        name: { iLike: `%${this.searchControl.value}%` },
        branchId: { eq: this._globalStateService.branch!.id },
      };

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
    }
  }
}
