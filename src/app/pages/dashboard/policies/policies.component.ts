import { NgClass } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
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
  GetPoliciesPageGQL,
  PolicyFilter,
  PolicyPartsFragment,
} from '@graphql';
import { debounceTime, merge, startWith } from 'rxjs';
import { PolicyDeleteDialogComponent } from './policy-delete-dialog/policy-delete-dialog.component';
import { PolicyFormDialogComponent } from './policy-form-dialog/policy-form-dialog.component';

@Component({
  selector: 'app-policies',
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
  templateUrl: './policies.component.html',
  styles: ``,
})
export class PoliciesComponent {
  @ViewChild('paginator') public paginator!: MatPaginator;
  public searchControl = new FormControl('');

  public displayedColumns: string[] = ['name', 'actions'];
  public dataSource = new MatTableDataSource<PolicyPartsFragment>([]);

  public loading = signal<boolean>(false);
  public totalCount = signal<number>(0);

  private readonly dialog = inject(MatDialog);
  private readonly _policiesPageGQL = inject(GetPoliciesPageGQL);

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

    const filter: PolicyFilter = {
      or: [{ name: { iLike: `%${this.searchControl.value}%` } }],
    };

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
