import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import {
  MatFormField,
  MatLabel,
  MatPrefix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { AvatarComponent } from '@components/avatar/avatar.component';
import {
  BranchFilter,
  BranchPartsFragment,
  GetCompaniesPageGQL,
} from '@graphql';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { BranchDeleteDialogComponent } from './branch-delete-dialog/branch-delete-dialog.component';
import { BranchFormDialogComponent } from './branch-form-dialog/branch-form-dialog.component';

@Component({
  selector: 'app-business',
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatFormField,
    MatInput,
    MatLabel,
    MatIconButton,
    MatIcon,
    MatPrefix,
    MatTooltip,
    MatTableModule,
    MatPaginatorModule,
    AvatarComponent,
  ],
  templateUrl: './branches.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class BranchsComponent {
  public readonly paginator = viewChild.required<MatPaginator>('paginator');
  public readonly searchTerm = signal('');

  public displayedColumns: string[] = ['name', 'actions'];
  public dataSource = new MatTableDataSource<BranchPartsFragment>([]);

  public loading = signal(false);
  public totalCount = signal(0);

  private readonly dialog = inject(MatDialog);
  private readonly _companiesPageGQL = inject(GetCompaniesPageGQL);

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

      this._companiesPageGQL
        .watch({
          variables: { limit, offset, filter },
          fetchPolicy: 'cache-and-network',
          nextFetchPolicy: 'cache-and-network',
          notifyOnNetworkStatusChange: true,
        })
        .valueChanges.subscribe({
          next: ({ data, loading }) => {
            const branches = data?.branches;
            const nodes = (branches?.nodes ?? []) as BranchPartsFragment[];
            const totalCount = branches?.totalCount ?? 0;

            this.dataSource.data = nodes;

            this.loading.set(loading);
            this.totalCount.set(totalCount);
          },
        });
    });
  }

  private _buildFilter(term: string): BranchFilter {
    return { name: { iLike: `%${term}%` } };
  }

  public onSearchInput(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  public openFormDialog(branch: BranchPartsFragment | undefined = undefined): void {
    const $dialog = this.dialog.open(BranchFormDialogComponent, {
      width: '32rem',
      data: branch,
      disableClose: true,
    });

    $dialog.afterClosed().subscribe({
      next: (branch) => {
        if (branch) this.refresh();
      },
    });
  }

  public openDeleteDialog(branch: BranchPartsFragment): void {
    const $dialog = this.dialog.open(BranchDeleteDialogComponent, {
      data: branch,
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
    const paginator = this.paginator();
    const filter = this._buildFilter(this.searchTerm());

    const limit = paginator.pageSize;
    const offset = paginator.pageIndex * limit;

    this._companiesPageGQL
      .watch({
        variables: { limit, offset, filter },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      })
      .valueChanges.subscribe({
        next: ({ data, loading }) => {
          const branches = data?.branches;
          const nodes = (branches?.nodes ?? []) as BranchPartsFragment[];
          const totalCount = branches?.totalCount ?? 0;

          this.dataSource.data = nodes;

          this.loading.set(loading);
          this.totalCount.set(totalCount);
        },
      });
  }
}