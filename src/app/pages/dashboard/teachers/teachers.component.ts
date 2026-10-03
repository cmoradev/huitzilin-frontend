import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
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
import { debounceTime, merge, startWith } from 'rxjs';
import { TeacherFormDialogComponent } from './teacher-form-dialog/teacher-form-dialog.component';
import { TeacherDeleteDialogComponent } from './teacher-delete-dialog/teacher-delete-dialog.component';

@Component({
  selector: 'app-teachers',
  imports: [
    NgClass,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    AvatarComponent,
    ReactiveFormsModule,
    MatTooltipModule,
  ],
  templateUrl: './teachers.component.html',
  styles: ``,
})
export class TeachersComponent implements AfterViewInit {
  @ViewChild('paginator') public paginator!: MatPaginator;
  public searchControl = new FormControl('');

  public displayedColumns: string[] = ['name', 'actions'];
  public dataSource = new MatTableDataSource<TeacherPartsFragment>([]);

  public loading = signal(false);
  public totalCount = signal(0);

  private readonly dialog = inject(MatDialog);
  private readonly _teachersPageGQL = inject(GetTeachersPageGQL);

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

  public refresh() {
    const limit: number = this.paginator.pageSize;
    const offset: number = this.paginator.pageIndex * limit;

    const filter: TeacherFilter = {
      fullname: { iLike: `%${this.searchControl.value}%` },
    };

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
