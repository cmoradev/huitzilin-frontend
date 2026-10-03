import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
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
import { toObservable } from '@angular/core/rxjs-interop';
import {
  GetLevelsPageGQL,
  LevelFilter,
  LevelPartsFragment,
  SetOrderInput,
  SetOrderLevelsGQL,
} from '@graphql';
import { GlobalStateService } from '@services';
import { debounceTime } from 'rxjs';
import { LevelDeleteDialogComponent } from './level-delete-dialog/level-delete-dialog.component';
import { LevelFormDialogComponent } from './level-form-dialog/level-form-dialog.component';

@Component({
  selector: 'app-levels',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    DragDropModule,
  ],
  templateUrl: './levels.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './levels.component.scss',
})
export class LevelsComponent {
  public readonly paginator = viewChild.required<MatPaginator>('paginator');

  public readonly searchTerm = signal('');

  public displayedColumns: string[] = ['name', 'actions'];
  public dataSource = new MatTableDataSource<LevelPartsFragment>([]);

  public loading = signal(false);
  public totalCount = signal(0);

  private readonly _snackBar = inject(MatSnackBar);

  private readonly dialog = inject(MatDialog);
  private readonly _setOrderLevelsGQL = inject(SetOrderLevelsGQL);
  private readonly _levelsPageGQL = inject(GetLevelsPageGQL);
  private readonly _globalStateService = inject(GlobalStateService);

  public readonly refreshTrigger = signal(0);

  public readonly filter = computed<LevelFilter | null>(() => {
    const branch = this._globalStateService.branch;
    if (!branch?.id) {
      return null;
    }

    const term = this.searchTerm();
    return {
      branchId: { eq: branch.id },
      or: [
        { name: { iLike: `%${term}%` } },
        { abbreviation: { iLike: `%${term}%` } },
      ],
    };
  });

  /**
   * Stream de búsqueda con debounce, expuesto como signal para integrarse
   * con el resto del flujo reactivo.
   */
  private readonly _debouncedSearchTerm = signal('');

  constructor() {
    // Debounce del término desde el input nativo.
    toObservable(this.searchTerm)
      .pipe(debounceTime(300))
      .subscribe((term) => this._debouncedSearchTerm.set(term));

    // Refresca la lista cuando cambian los criterios reactivos.
    effect(() => {
      const paginator = this.paginator();
      const filter = this._buildFilter(this._debouncedSearchTerm());
      this.refreshTrigger();

      if (!filter) {
        return;
      }

      const limit = paginator.pageSize;
      const offset = paginator.pageIndex * limit;

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
    });
  }

  private _buildFilter(term: string): LevelFilter | null {
    const branch = this._globalStateService.branch;
    if (!branch?.id) {
      return null;
    }

    return {
      branchId: { eq: branch.id },
      or: [
        { name: { iLike: `%${term}%` } },
        { abbreviation: { iLike: `%${term}%` } },
      ],
    };
  }

  public onSearchInput(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
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

  public refresh(): void {
    this.refreshTrigger.update((v) => v + 1);
  }

  public dropLevel(event: CdkDragDrop<LevelPartsFragment[]>): void {
    const values = [...this.dataSource.data];
    moveItemInArray(values, event.previousIndex, event.currentIndex);
    this.dataSource.data = values;

    this.updateOrderLevels();
  }

  private updateOrderLevels(): void {
    const paginator = this.paginator();
    const limit = paginator.pageSize;
    const offset = paginator.pageIndex * limit;

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