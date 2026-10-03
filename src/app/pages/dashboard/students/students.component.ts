import { NgClass } from '@angular/common';
import { AfterViewInit, Component, inject, signal, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import {
  MatCardModule,
} from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import {
  MatFormFieldModule,
} from '@angular/material/form-field';
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
import { debounceTime, merge, startWith } from 'rxjs';
import { StudentDeleteDialogComponent } from './student-delete-dialog/student-delete-dialog.component';
import { StudentFormDialogComponent } from './student-form-dialog/student-form-dialog.component';
import { StudentDocumentsDialogComponent } from './student-documents-dialog/student-documents-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-students',
  imports: [
    NgClass,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconButton,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    AvatarComponent,
    ReactiveFormsModule,
    MatTooltipModule,
  ],
  templateUrl: './students.component.html',
  styles: ``,
})
export class StudentsComponent implements AfterViewInit {
  @ViewChild('paginator') public paginator!: MatPaginator;
  public searchControl = new FormControl('');

  public displayedColumns: string[] = ['name', 'details', 'actions'];
  public dataSource = new MatTableDataSource<StudentPartsFragment>([]);

  public loading = signal(false);
  public totalCount = signal(0);

  private readonly dialog = inject(MatDialog);
  private readonly _companiesPageGQL = inject(GetStudentsPageGQL);

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

  public refresh() {
    const limit: number = this.paginator.pageSize;
    const offset: number = this.paginator.pageIndex * limit;

    const filter: StudentFilter = {
      fullname: { iLike: `%${this.searchControl.value}%` },
    };

    this._companiesPageGQL
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

          this.dataSource.data = nodes.map((node) => {
            return {
              ...node,
            };
          });

          this.loading.set(loading);
          this.totalCount.set(totalCount);
        },
      });
  }
}
