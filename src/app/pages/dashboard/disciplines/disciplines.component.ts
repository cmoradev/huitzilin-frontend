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
  DisciplineFilter,
  DisciplinePartsFragment,
  GetDisciplinesPageGQL,
} from '@graphql';
import { GlobalStateService } from '@services';
import { debounceTime, merge, startWith } from 'rxjs';
import { DisciplineDeleteDialogComponent } from './discipline-delete-dialog/discipline-delete-dialog.component';
import { DisciplineFormDialogComponent } from './discipline-form-dialog/discipline-form-dialog.component';
import { NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-disciplines',
  imports: [
    NgClass,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
  templateUrl: './disciplines.component.html',
  styles: ``,
})
export class DisciplinesComponent {
  @ViewChild('paginator') public paginator!: MatPaginator;
  public searchControl = new FormControl('');

  public displayedColumns: string[] = ['name', 'actions'];
  public dataSource = new MatTableDataSource<DisciplinePartsFragment>([]);

  public loading = signal<boolean>(false);
  public totalCount = signal<number>(0);

  private readonly dialog = inject(MatDialog);
  private readonly _disciplinesPageGQL = inject(GetDisciplinesPageGQL);
  private readonly _globalStateService = inject(GlobalStateService);

  ngAfterViewInit(): void {
    merge(
      this.paginator.page,
      this.searchControl.valueChanges,
      this._globalStateService.branch$
    )
      .pipe(debounceTime(300), startWith({}))
      .subscribe({
        next: () => {
          this.refresh();
        },
      });
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

  public refresh() {
    if (this._globalStateService.branch?.id) {
      const limit: number = this.paginator.pageSize;
      const offset: number = this.paginator.pageIndex * limit;

      const filter: DisciplineFilter = {
        name: { iLike: `%${this.searchControl.value}%` },
        branchId: { eq: this._globalStateService.branch!.id },
      };

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
}
