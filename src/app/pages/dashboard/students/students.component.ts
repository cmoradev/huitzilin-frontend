import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AvatarComponent } from '@components/avatar/avatar.component';
import {
  GetStudentsPageGQL,
  StudentFilter,
  StudentPartsFragment,
} from '@graphql';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { StudentDeleteDialogComponent } from './student-delete-dialog/student-delete-dialog.component';
import { StudentFormDialogComponent } from './student-form-dialog/student-form-dialog.component';
import { StudentDocumentsDialogComponent } from './student-documents-dialog/student-documents-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-students',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconButton,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    AvatarComponent,
    MatTooltipModule,
  ],
  templateUrl: './students.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class StudentsComponent {
  public readonly paginator = viewChild.required<MatPaginator>('paginator');
  public readonly searchTerm = signal('');

  public displayedColumns: string[] = ['name', 'details', 'actions'];
  public dataSource = new MatTableDataSource<StudentPartsFragment>([]);

  public loading = signal(false);
  public totalCount = signal(0);

  private readonly dialog = inject(MatDialog);
  private readonly _studentsPageGQL = inject(GetStudentsPageGQL);

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

      this._studentsPageGQL
        .watch({
          variables: { limit, offset, filter },
          fetchPolicy: 'cache-and-network',
          nextFetchPolicy: 'cache-and-network',
          notifyOnNetworkStatusChange: true,
        })
        .valueChanges.subscribe({
          next: ({ data, loading }) => {
            const students = data?.students;
            const nodes = (students?.nodes ?? []) as StudentPartsFragment[];
            const totalCount = students?.totalCount ?? 0;

            this.dataSource.data = nodes;

            this.loading.set(loading);
            this.totalCount.set(totalCount);
          },
        });
    });
  }

  private _buildFilter(term: string): StudentFilter {
    return { fullname: { iLike: `%${term}%` } };
  }

  public onSearchInput(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  public openDoucumentsDialog(value: StudentPartsFragment): void {
    this.dialog.open(StudentDocumentsDialogComponent, {
      width: '64rem',
      data: value,
      disableClose: true,
    });
  }

  public openFormDialog(
    value: StudentPartsFragment | undefined = undefined
  ): void {
    const $dialog = this.dialog.open(StudentFormDialogComponent, {
      width: '32rem',
      data: value,
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (student) => {
        if (student) this.refresh();
      },
    });
  }

  public openDeleteDialog(value: StudentPartsFragment): void {
    const $dialog = this.dialog.open(StudentDeleteDialogComponent, {
      data: value,
      width: '32rem',
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (student) => {
        if (student) this.refresh();
      },
    });
  }

  public refresh(): void {
    const paginator = this.paginator();
    const filter = this._buildFilter(this.searchTerm());

    const limit = paginator.pageSize;
    const offset = paginator.pageIndex * limit;

    this._studentsPageGQL
      .watch({
        variables: { limit, offset, filter },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      })
      .valueChanges.subscribe({
        next: ({ data, loading }) => {
          const students = data?.students;
          const nodes = (students?.nodes ?? []) as StudentPartsFragment[];
          const totalCount = students?.totalCount ?? 0;

          this.dataSource.data = nodes;

          this.loading.set(loading);
          this.totalCount.set(totalCount);
        },
      });
  }
}