import { NgClass } from '@angular/common';
import { Component, inject, signal, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardModule,
  MatCardTitle,
} from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
  MatPrefix,
} from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { CycleFilter, CyclePartsFragment, GetCyclesPageGQL } from '@graphql';
import { debounceTime, merge, startWith } from 'rxjs';
import { CycleFormDialogComponent } from './cycle-form-dialog/cycle-form-dialog.component';
import { CycleDeleteDialogComponent } from './cycle-delete-dialog/cycle-delete-dialog.component';
import { GlobalStateService } from '@services';

@Component({
  selector: 'app-cycles',
  imports: [
    NgClass,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
  ],
  templateUrl: './cycles.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class CyclesComponent {
  @ViewChild('paginator') public paginator!: MatPaginator;
  public searchControl = new FormControl('');

  public displayedColumns: string[] = ['name', 'actions'];
  public dataSource = new MatTableDataSource<CyclePartsFragment>([]);

  public loading = signal(false);
  public totalCount = signal(0);

  private readonly dialog = inject(MatDialog);
  private readonly _cyclesPageGQL = inject(GetCyclesPageGQL);

  ngAfterViewInit(): void {
    merge(
      this.paginator.page,
      this.searchControl.valueChanges,
    )
      .pipe(debounceTime(300), startWith({}))
      .subscribe({
        next: () => {
          this.refresh();
        },
      });
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

  public refresh() {
    const limit: number = this.paginator.pageSize;
    const offset: number = this.paginator.pageIndex * limit;

    const filter: CycleFilter = {
      name: { iLike: `%${this.searchControl.value}%` },
    };

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
  }
}
