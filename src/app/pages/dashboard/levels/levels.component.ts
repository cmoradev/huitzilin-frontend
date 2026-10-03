import { NgClass } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
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
  GetLevelsPageGQL,
  LevelFilter,
  LevelPartsFragment,
  SetOrderInput,
  SetOrderLevelsGQL,
} from '@graphql';
import { GlobalStateService } from '@services';
import { debounceTime, merge, startWith } from 'rxjs';
import { LevelDeleteDialogComponent } from './level-delete-dialog/level-delete-dialog.component';
import { LevelFormDialogComponent } from './level-form-dialog/level-form-dialog.component';

@Component({
  selector: 'app-levels',
  imports: [
    NgClass,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    DragDropModule,
  ],
  templateUrl: './levels.component.html',
  styleUrl: './levels.component.scss',
})
export class LevelsComponent {
  @ViewChild('paginator') public paginator!: MatPaginator;
  public searchControl = new FormControl('');

  public displayedColumns: string[] = ['name', 'actions'];
  public dataSource = new MatTableDataSource<LevelPartsFragment>([]);

  public loading = signal(false);
  public totalCount = signal(0);

  private readonly _snackBar = inject(MatSnackBar);

  private readonly dialog = inject(MatDialog);
  private readonly _setOrderLevelsGQL = inject(SetOrderLevelsGQL);
  private readonly _levelsPageGQL = inject(GetLevelsPageGQL);
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
    level: LevelPartsFragment | undefined = undefined
  ): void {
    const $dialog = this.dialog.open(LevelFormDialogComponent, {
      width: '32rem',
      data: level,
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (branch) => {
        if (branch) this.refresh();
      },
    });
  }

  public openDeleteDialog(level: LevelPartsFragment): void {
    const $dialog = this.dialog.open(LevelDeleteDialogComponent, {
      data: level,
      width: '32rem',
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (branch) => {
        if (branch) this.refresh();
      },
    });
  }

  public refresh() {
    const limit: number = this.paginator.pageSize;
    const offset: number = this.paginator.pageIndex * limit;

    const filter: LevelFilter = {
      branchId: { eq: this._globalStateService.branch!.id },
      or: [
        {
          name: { iLike: `%${this.searchControl.value}%` },
          abbreviation: { iLike: `%${this.searchControl.value}%` },
        },
      ],
    };

    this._levelsPageGQL
      .watch({
        variables: { limit, offset, filter },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      })
      .valueChanges.subscribe({
        next: ({ data, loading }) => {
          const levels = data?.levels;
          const nodes = (levels?.nodes ?? []) as LevelPartsFragment[];
          const totalCount = levels?.totalCount ?? 0;

          this.dataSource.data = nodes;

          this.loading.set(loading);
          this.totalCount.set(totalCount);
        },
      });
  }

  public dropLevel(event: CdkDragDrop<LevelPartsFragment[]>) {
    const values = [...this.dataSource.data];
    moveItemInArray(values, event.previousIndex, event.currentIndex);
    this.dataSource.data = values;

    this.updateOrderLevels();
  }

  private updateOrderLevels(): void {
    const limit: number = this.paginator.pageSize;
    const offset: number = this.paginator.pageIndex * limit;

    const payload: SetOrderInput[] = this.dataSource.data.map(
      (item, index) => ({
        id: item.id,
        order: index + 1 + offset,
      })
    );

    this._setOrderLevelsGQL.mutate({ variables: { payload } }).subscribe({
      next: () => {
        this._snackBar.open('Se ha actualizado el orden correctamente', 'Cerrar', {
          duration: 1000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      },
      error: (error) => {
        console.error('Error updating order activities', error);
      },
    });
  }
}
