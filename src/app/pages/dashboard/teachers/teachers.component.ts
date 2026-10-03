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
import { AvatarComponent } from '@components/avatar/avatar.component';
import {
  GetTeachersPageGQL,
  TeacherFilter,
  TeacherPartsFragment,
} from '@graphql';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { TeacherFormDialogComponent } from './teacher-form-dialog/teacher-form-dialog.component';
import { TeacherDeleteDialogComponent } from './teacher-delete-dialog/teacher-delete-dialog.component';

@Component({
  selector: 'app-teachers',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    AvatarComponent,
    MatTooltipModule,
  ],
  templateUrl: './teachers.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class TeachersComponent {
  public readonly paginator = viewChild.required<MatPaginator>('paginator');
  public readonly searchTerm = signal('');

  public displayedColumns: string[] = ['name', 'actions'];
  public dataSource = new MatTableDataSource<TeacherPartsFragment>([]);

  public loading = signal(false);
  public totalCount = signal(0);

  private readonly dialog = inject(MatDialog);
  private readonly _teachersPageGQL = inject(GetTeachersPageGQL);

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

      this._teachersPageGQL
        .watch({
          variables: { limit, offset, filter },
          fetchPolicy: 'cache-and-network',
          nextFetchPolicy: 'cache-and-network',
          notifyOnNetworkStatusChange: true,
        })
        .valueChanges.subscribe({
          next: ({ data, loading }) => {
            const teachers = data?.teachers;
            const nodes = (teachers?.nodes ?? []) as TeacherPartsFragment[];
            const totalCount = teachers?.totalCount ?? 0;

            this.dataSource.data = nodes;

            this.loading.set(loading);
            this.totalCount.set(totalCount);
          },
        });
    });
  }

  private _buildFilter(term: string): TeacherFilter {
    return { fullname: { iLike: `%${term}%` } };
  }

  public onSearchInput(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  public openFormDialog(
    value: TeacherPartsFragment | undefined = undefined
  ): void {
    const $dialog = this.dialog.open(TeacherFormDialogComponent, {
      width: '32rem',
      data: value,
      disableClose: true,
    });
    $dialog.afterClosed().subscribe({
      next: (teacher) => {
        if (teacher) this.refresh();
      },
    });
  }

  public openDeleteDialog(value: TeacherPartsFragment): void {
    const $dialog = this.dialog.open(TeacherDeleteDialogComponent, {
      data: value,
      width: '32rem',
      disableClose: true,
    });
    $dialog.afterClosed().subscribe({
      next: (teacher) => {
        if (teacher) this.refresh();
      },
    });
  }

  public refresh(): void {
    const paginator = this.paginator();
    const filter = this._buildFilter(this.searchTerm());

    const limit = paginator.pageSize;
    const offset = paginator.pageIndex * limit;

    this._teachersPageGQL
      .watch({
        variables: { limit, offset, filter },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      })
      .valueChanges.subscribe({
        next: ({ data, loading }) => {
          const teachers = data?.teachers;
          const nodes = (teachers?.nodes ?? []) as TeacherPartsFragment[];
          const totalCount = teachers?.totalCount ?? 0;

          this.dataSource.data = nodes;

          this.loading.set(loading);
          this.totalCount.set(totalCount);
        },
      });
  }
}